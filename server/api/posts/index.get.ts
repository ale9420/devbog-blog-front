import qs from 'qs';

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()
  const page = query.page ? Number(query.page) : 1
  const pageSize = query.pageSize ? Number(query.pageSize) : 10
  const locale = query.locale as string | undefined
  const category = query.category as string | undefined
  const tag = query.tag as string | undefined

  const filters: Record<string, unknown> = {}
  if (category) filters.category = { name: { $eq: category } }
  if (tag) filters.tags = { $contains: tag }

  const params = qs.stringify({
    pagination: { page, pageSize },
    populate: {
      cover: { populate: '*' },
      category: { populate: '*' },
      author: { populate: '*' },
      seo: { populate: '*' },
    },
    sort: 'publishedAt:desc',
    locale,
    ...(Object.keys(filters).length > 0 ? { filters } : {}),
  }, { skipNulls: true })

  const headers: Record<string, string> = {}
  if (config.strapiApiToken) {
    headers['Authorization'] = `Bearer ${config.strapiApiToken}`
  }

  setHeader(event, 'Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')

  try {
    const response = await $fetch(`${config.public.strapiUrl}/api/articles?${params}`, { headers })
    return response
  } catch (error: unknown) {
    throw createError({
      statusCode: asUpstreamError(error).response?.status === 400 ? 400 : 502,
      message: 'Failed to fetch posts',
    })
  }
})
