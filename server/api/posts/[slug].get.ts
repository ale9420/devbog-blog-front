import qs from 'qs'
import type { RawStrapiArticle } from '~/interfaces'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const query = getQuery(event)
  const locale = query.locale as string | undefined

  if (!slug) {
    throw createError({ statusCode: 400, message: 'Slug is required' })
  }

  const params = qs.stringify({
    filters: { slug: { $eq: slug } },
    locale,
    populate: ARTICLE_POPULATE,
  }, { skipNulls: true })

  setHeader(event, 'Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')

  let response: { data?: RawStrapiArticle[] }
  try {
    response = await strapiFetch<{ data?: RawStrapiArticle[] }>(
      `/api/articles?${params}`,
    )
  } catch (error: unknown) {
    console.error('Strapi fetch post error:', asUpstreamError(error).data || error)
    throw createError({
      statusCode: 502,
      message: upstreamErrorMessage(error, 'Failed to fetch post'),
    })
  }

  const data = response.data
  if (!data || data.length === 0) {
    throw createError({ statusCode: 404, message: 'Post not found' })
  }

  return data[0]
})
