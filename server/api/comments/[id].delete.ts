export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const id = getRouterParam(event, 'id')
  const relation = query.relation as string
  const authorId = query.authorId as string

  if (!relation || !id) {
    throw createError({
      statusCode: 400,
      message: 'Relation and comment ID are required'
    })
  }

  const headers: Record<string, string> = {}
  if (config.strapiApiToken) {
    headers['Authorization'] = `Bearer ${config.strapiApiToken}`
  }

  const url = new URL(`${config.public.strapiUrl}/api/comments/${relation}/comment/${id}`)
  if (authorId) {
    url.searchParams.append('authorId', authorId)
  }

  try {
    const response = await $fetch(url.toString(), {
      method: 'DELETE',
      headers
    })
    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.message || 'Failed to delete comment'
    })
  }
})
