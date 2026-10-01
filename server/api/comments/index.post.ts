import { randomUUID } from 'node:crypto'
import type { Comment } from '~/interfaces/comment'
import { toGuestComment, toPublicComment } from '~/helpers/comments'

export default defineEventHandler(async (event): Promise<Comment> => {
  assertSameOrigin(event)
  const config = useRuntimeConfig()
  const relation = commentRelation(event)
  const body = await readBody<Record<string, unknown> | null>(event).catch(() => null)
  const comment = toGuestComment(body, `guest-${randomUUID()}`)

  if (!comment) {
    throw createError({
      statusCode: 400,
      message: 'Content, author name and a valid email are required'
    })
  }

  const locale = commentLocale(body?.locale)
  assertRateLimit(event, 'commentPerIp', clientIp(event))

  const url = `${config.public.strapiUrl}/api/comments/${relation}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  if (config.strapiApiToken) {
    headers['Authorization'] = `Bearer ${config.strapiApiToken}`
  }

  try {
    const response = await $fetch<Comment>(url, {
      method: 'POST',
      headers,
      body: { ...comment, locale }
    })
    return toPublicComment(response)
  } catch (error: unknown) {
    console.error('Strapi comment error:', asUpstreamError(error).data || error)
    throw createError({
      statusCode: asUpstreamError(error).response?.status || 500,
      message: upstreamErrorMessage(error, 'Failed to post comment'),
    })
  }
})
