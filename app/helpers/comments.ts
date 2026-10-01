import type { Comment, CommentAuthor, CommentFilter, GuestComment } from '../interfaces/comment'
import { isValidEmail } from './auth'

const HIDDEN_STATUSES = new Set(['PENDING', 'REJECTED'])
const WEB_PROTOCOLS = new Set(['https:', 'http:'])
const RELATION_PATTERN = /^api::article\.article:[\w-]{1,128}$/

export const COMMENT_LIMITS = { name: 100, email: 254, content: 5000, avatar: 2048 } as const

function textOrNull(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function webUrlOrNull(value: unknown): string | null {
  const text = textOrNull(value)
  if (!text) return null
  try {
    const url = new URL(text)
    return WEB_PROTOCOLS.has(url.protocol) ? url.href : null
  }
  catch {
    return null
  }
}

function toPublicAuthor(author: CommentAuthor | undefined): CommentAuthor {
  return {
    id: author?.id,
    name: author?.name ?? '',
    avatar: author?.avatar ?? null,
  }
}

export function isVisibleComment(comment: Comment): boolean {
  return !HIDDEN_STATUSES.has(comment.approvalStatus ?? '')
}

export function toPublicComment(comment: Comment): Comment {
  return {
    ...comment,
    author: toPublicAuthor(comment.author),
    isAdminComment: comment.isAdminComment === true,
    fediverseActorHandle: textOrNull(comment.fediverseActorHandle),
    fediverseUri: webUrlOrNull(comment.fediverseUri),
    ...(comment.children ? { children: toPublicComments(comment.children) } : {}),
  }
}

export function toPublicComments(comments: Comment[]): Comment[] {
  return comments.filter(isVisibleComment).map(toPublicComment)
}

export function isFediverseComment(comment: Comment): boolean {
  return Boolean(comment.fediverseActorHandle || comment.fediverseUri)
}

export function matchesCommentFilter(comment: Comment, filter: CommentFilter): boolean {
  if (filter === 'all') return true
  return isFediverseComment(comment) === (filter === 'fediverse')
}

export function isCommentRelation(value: unknown): value is string {
  return typeof value === 'string' && RELATION_PATTERN.test(value)
}

function boundedText(value: unknown, max: number): string | null {
  const text = textOrNull(value)
  return text && text.length <= max ? text : null
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {}
}

export function toGuestComment(body: unknown, authorId: string): GuestComment | null {
  const input = record(body)
  const author = record(input.author)
  const name = boundedText(author.name, COMMENT_LIMITS.name)
  const email = boundedText(author.email, COMMENT_LIMITS.email)
  const content = boundedText(input.content, COMMENT_LIMITS.content)
  if (!name || !email || !isValidEmail(email) || !content) return null

  const comment: GuestComment = { author: { id: authorId, name, email: email.toLowerCase() }, content }
  const avatar = webUrlOrNull(author.avatar)
  if (avatar && avatar.length <= COMMENT_LIMITS.avatar) comment.author.avatar = avatar
  if (input.threadOf !== undefined && input.threadOf !== null) {
    if (!Number.isSafeInteger(input.threadOf) || (input.threadOf as number) < 1) return null
    comment.threadOf = input.threadOf as number
  }
  return comment
}
