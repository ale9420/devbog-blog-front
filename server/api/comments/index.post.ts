import { randomUUID } from 'node:crypto'
import type { Comment } from '~/interfaces/comment'
import { toGuestComment, toPublicComment } from '~/helpers/comments'

export default defineEventHandler(async (event): Promise<Comment> => {
  assertSameOrigin(event)
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

  const url = `/api/comments/${relation}`

  try {
    const response = await strapiFetch<Comment>(url, {
      method: 'POST',
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
