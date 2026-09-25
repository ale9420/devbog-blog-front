import qs from 'qs'
import type { RawStrapiArticle, ReadingPath, ReadingPathStep, StrapiPaginatedResponse } from '~/interfaces'
import { isCategory } from '~/helpers/categories'

const MAX_STEPS = 50

export default defineEventHandler(async (event): Promise<ReadingPath> => {
  const query = getQuery(event)
  const config = useRuntimeConfig()
  const category = typeof query.category === 'string' ? query.category.trim().toLowerCase() : ''
  const locale = typeof query.locale === 'string' && query.locale ? query.locale : undefined

  if (!isCategory(category)) {
    throw createError({ statusCode: 400, message: 'Unknown category' })
  }

  const headers: Record<string, string> = {}
  if (config.strapiApiToken) {
    headers['Authorization'] = `Bearer ${config.strapiApiToken}`
  }

  async function fetchSteps(editorial: boolean): Promise<ReadingPathStep[]> {
    const params = qs.stringify({
      filters: {
        category: { slug: { $eq: category } },
        ...(editorial ? { pathOrder: { $notNull: true } } : {}),
      },
      fields: ['documentId', 'slug', 'title'],
      sort: editorial ? ['pathOrder:asc', 'publishedAt:asc'] : 'publishedAt:asc',
      pagination: { page: 1, pageSize: MAX_STEPS },
      locale,
    }, { skipNulls: true })
    const response = await $fetch<StrapiPaginatedResponse<RawStrapiArticle[]>>(`${config.public.strapiUrl}/api/articles?${params}`, { headers })
    return response.data.map(article => ({ documentId: article.documentId, slug: article.slug, title: article.title }))
  }

  setHeader(event, 'Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')

  try {
    let editorial: ReadingPathStep[] = []
    try {
      editorial = await fetchSteps(true)
    } catch (error: unknown) {
      if (asUpstreamError(error).response?.status !== 400) throw error
    }
    if (editorial.length > 0) return { category, editorial: true, steps: editorial }
    return { category, editorial: false, steps: await fetchSteps(false) }
  } catch (error: unknown) {
    console.error('Strapi fetch reading path error:', asUpstreamError(error).data || error)
    throw createError({ statusCode: 502, message: upstreamErrorMessage(error, 'Failed to fetch the reading path') })
  }
})
