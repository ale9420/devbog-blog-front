import qs from 'qs';

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()
  const relation = query.relation as string

  if (!relation) {
    throw createError({
      statusCode: 400,
      message: 'Relation parameter is required'
    })
  }

  const params = qs.stringify({
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
    },
    sort: query.sort,
  }, { skipNulls: true })

  const headers: Record<string, string> = {}
  if (config.strapiApiToken) {
    headers['Authorization'] = `Bearer ${config.strapiApiToken}`
  }

  const url = `${config.public.strapiUrl}/api/comments/${relation}/flat${params ? '?' + params : ''}`

  try {
    const response = await $fetch(url, { headers })
    return response
  } catch (error: unknown) {
    console.error('Strapi fetch comments (flat) error:', asUpstreamError(error).data || error)
    throw createError({
      statusCode: asUpstreamError(error).response?.status || 500,
      message: upstreamErrorMessage(error, 'Failed to fetch comments'),
    })
  }
})
