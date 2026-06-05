export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const relation = query.relation as string

  if (!relation) {
    throw createError({
      statusCode: 400,
      message: 'Relation parameter is required'
    })
  }

  if (!body.content || !body.author?.name) {
    throw createError({
      statusCode: 400,
      message: 'Content and author name are required'
    })
  }

  const url = `${config.public.strapiUrl}/api/comments/${relation}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  if (config.strapiApiToken) {
    headers['Authorization'] = `Bearer ${config.strapiApiToken}`
  }

  try {
    const response = await $fetch(url, {
      method: 'POST',
      headers,
      body
    })
    return response
  } catch (error: any) {
    console.error('Strapi comment error:', error.data || error)
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.error?.message || error.message || 'Failed to post comment'
    })
  }
})
