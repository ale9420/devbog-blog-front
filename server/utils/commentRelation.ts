import type { H3Event } from 'h3'
import { isCommentRelation } from '~/helpers/comments'

export function commentRelation(event: H3Event): string {
  const relation = getQuery(event).relation
  if (isCommentRelation(relation)) return relation
  throw createError({
    statusCode: 400,
    message: 'A valid relation parameter is required'
  })
}
