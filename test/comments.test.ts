import { describe, it, expect } from 'vitest'
import type { Comment } from '../app/interfaces/comment'
import { isFediverseComment, matchesCommentFilter, toPublicComment, toPublicComments } from '../app/helpers/comments'

function comment(overrides: Partial<Comment> = {}): Comment {
  return {
    id: 1,
    content: 'Hello',
    blocked: false,
    blockedThread: false,
    blockReason: null,
    authorUser: null,
    removed: false,
    approvalStatus: 'APPROVED',
    author: { id: 'guest-1', name: 'Ana', email: 'ana@example.com' },
    createdAt: '2026-02-03T10:00:00.000Z',
    updatedAt: '2026-02-03T10:00:00.000Z',
    related: { id: 1 },
    reports: [],
    threadOf: null,
    ...overrides,
  }
}

const fediverse = comment({
  id: 2,
  fediverseActorHandle: '@bea@mastodon.social',
  fediverseUri: 'https://mastodon.social/users/bea/statuses/1',
})

describe('toPublicComment', () => {
  it('fills the fediverse fields with null on blog comments and drops the email', () => {
    const result = toPublicComment(comment())
    expect(result).toMatchObject({ fediverseActorHandle: null, fediverseUri: null, isAdminComment: false })
    expect(result.author).toEqual({ id: 'guest-1', name: 'Ana', avatar: null })
  })

  it('keeps the handle and the http(s) link of fediverse replies', () => {
    expect(toPublicComment(fediverse)).toMatchObject({
      fediverseActorHandle: '@bea@mastodon.social',
      fediverseUri: 'https://mastodon.social/users/bea/statuses/1',
    })
  })

  it('drops links that are not http(s) and blank handles', () => {
    expect(toPublicComment(comment({ fediverseUri: 'javascript:alert(1)', fediverseActorHandle: '  ' }))).toMatchObject({
      fediverseUri: null,
      fediverseActorHandle: null,
    })
    expect(toPublicComment(comment({ fediverseUri: 'not a url' })).fediverseUri).toBeNull()
  })

  it('marks author replies only when the backend flags them', () => {
    expect(toPublicComment(comment({ isAdminComment: true })).isAdminComment).toBe(true)
    expect(toPublicComment(comment({ isAdminComment: null })).isAdminComment).toBe(false)
  })
})

describe('toPublicComments', () => {
  it('hides pending and rejected comments, and hidden children with them', () => {
    const pending = comment({ id: 3, approvalStatus: 'PENDING' })
    const rejected = comment({ id: 4, approvalStatus: 'REJECTED' })
    const legacy = comment({ id: 5, approvalStatus: null })
    const parent = comment({ id: 6, children: [pending, comment({ id: 7 })] })
    const result = toPublicComments([comment(), pending, rejected, legacy, parent])
    expect(result.map(item => item.id)).toEqual([1, 5, 6])
    expect(result[2]?.children?.map(item => item.id)).toEqual([7])
  })
})

describe('matchesCommentFilter', () => {
  it('tells fediverse replies from blog comments', () => {
    expect(isFediverseComment(fediverse)).toBe(true)
    expect(isFediverseComment(comment({ fediverseUri: 'https://mastodon.social/@bea/1' }))).toBe(true)
    expect(isFediverseComment(comment())).toBe(false)
  })

  it('keeps every comment for all, and splits blog and fediverse', () => {
    expect(matchesCommentFilter(comment(), 'all')).toBe(true)
    expect(matchesCommentFilter(fediverse, 'all')).toBe(true)
    expect(matchesCommentFilter(comment(), 'blog')).toBe(true)
    expect(matchesCommentFilter(fediverse, 'blog')).toBe(false)
    expect(matchesCommentFilter(fediverse, 'fediverse')).toBe(true)
    expect(matchesCommentFilter(comment(), 'fediverse')).toBe(false)
  })
})
