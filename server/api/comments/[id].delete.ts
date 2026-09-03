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

  if (!authorId) {
    throw createError({
      statusCode: 401,
      message: 'Author ID is required to delete a comment'
    })
  }

  const headers: Record<string, string> = {}
  if (config.strapiApiToken) {
    headers['Authorization'] = `Bearer ${config.strapiApiToken}`
  }

  try {
    const commentResponse = await $fetch<any>(
      `${config.public.strapiUrl}/api/comments/${relation}/comment/${id}`,
      { headers }
    )

    const commentAuthorId = commentResponse?.data?.author?.id || commentResponse?.author?.id
    if (commentAuthorId !== authorId) {
      throw createError({
        statusCode: 403,
        message: 'You can only delete your own comments'
      })
    }

    const url = new URL(`${config.public.strapiUrl}/api/comments/${relation}/comment/${id}`)
    url.searchParams.append('authorId', authorId)

    const response = await $fetch(url.toString(), {
      method: 'DELETE',
      headers
    })
    return response
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.message || 'Failed to delete comment'
    })
  }
})
