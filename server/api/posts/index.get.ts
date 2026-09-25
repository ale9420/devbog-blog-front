import qs from 'qs';
import type { BlogSort, RawStrapiArticle, StrapiPaginatedResponse } from '~/interfaces'
import { parseSort } from '~/helpers/blog'
import { MIN_SEARCH_LENGTH } from '~/helpers/search'

const RANKING_TIMEOUT_MS = 3000

const POPULATE = {
  cover: { populate: '*' },
  category: { populate: '*' },
  author: { populate: '*' },
  seo: { populate: '*' },
}

interface RankingPage {
  data: Array<{ documentId: string }>
  meta: StrapiPaginatedResponse<unknown>['meta']
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()
  const page = query.page ? Number(query.page) : 1
  const pageSize = query.pageSize ? Number(query.pageSize) : 10
  const locale = query.locale as string | undefined
  const category = query.category as string | undefined
  const tag = query.tag as string | undefined
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const sort: BlogSort = parseSort(query.sort) ?? 'recent'
  const validSearch = search.length >= MIN_SEARCH_LENGTH ? search : undefined

  const filters: Record<string, unknown> = {}
  if (category) filters.category = { slug: { $eq: category } }
  if (tag) filters.tags = { $contains: tag }
  if (validSearch) filters.title = { $containsi: validSearch }

  const headers: Record<string, string> = {}
  if (config.strapiApiToken) {
    headers['Authorization'] = `Bearer ${config.strapiApiToken}`
  }

  async function fetchArticles(params: Record<string, unknown>): Promise<StrapiPaginatedResponse<RawStrapiArticle[]>> {
    const queryString = qs.stringify({ populate: POPULATE, locale, ...params }, { skipNulls: true })
    return $fetch<StrapiPaginatedResponse<RawStrapiArticle[]>>(`${config.public.strapiUrl}/api/articles?${queryString}`, { headers })
  }

  async function fetchRanked(): Promise<StrapiPaginatedResponse<RawStrapiArticle[]> | null> {
    let ranking: RankingPage
    try {
      ranking = await $fetch<RankingPage>(`${config.public.strapiUrl}/api/fediverse/articles/ranking`, {
        query: { page, pageSize, locale, category, search: validSearch },
        timeout: RANKING_TIMEOUT_MS,
      })
    } catch (error: unknown) {
      console.error('Strapi fetch fediverse ranking error:', asUpstreamError(error).data || error)
      return null
    }

    const ids = ranking.data.map(row => row.documentId)
    if (ids.length === 0) return { data: [], meta: ranking.meta }

    const articles = await fetchArticles({
      filters: { ...filters, documentId: { $in: ids } },
      pagination: { page: 1, pageSize: ids.length },
    })
    const byId = new Map(articles.data.map(article => [article.documentId, article]))
    return {
      data: ids.flatMap(id => byId.get(id) ?? []),
      meta: ranking.meta,
    }
  }

  setHeader(event, 'Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')

  try {
    if (sort === 'fediverse') {
      const ranked = await fetchRanked()
      if (ranked) return ranked
    }
    return await fetchArticles({
      pagination: { page, pageSize },
      sort: sort === 'oldest' ? 'publishedAt:asc' : 'publishedAt:desc',
      ...(Object.keys(filters).length > 0 ? { filters } : {}),
    })
  } catch (error: unknown) {
    throw createError({
      statusCode: asUpstreamError(error).response?.status === 400 ? 400 : 502,
      message: 'Failed to fetch posts',
    })
  }
})
