export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const id = getRouterParam(event, 'id')
  const relation = query.relation as string

  if (!relation || !id) {
    throw createError({
      statusCode: 400,
      message: 'Relation and comment ID are required'
    })
  }

  if (!body.content) {
    throw createError({
      statusCode: 400,
      message: 'Content is required'
    })
  }

  const headers: Record<string, string> = {}
  if (config.strapiApiToken) {
    headers['Authorization'] = `Bearer ${config.strapiApiToken}`
  }

  const url = `${config.public.strapiUrl}/api/comments/${relation}/comment/${id}`

  try {
    const response = await $fetch(url, {
      method: 'PUT',
      headers,
      body
    })
    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.message || 'Failed to update comment'
    })
  }
})
