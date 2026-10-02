import { describe, expect, it } from 'vitest'
import { deleteAccountSchema, emailSchema, loginSchema, registerSchema, resetPasswordSchema } from '../server/schemas/auth'
import { guestCommentSchema } from '../server/schemas/comments'
import { subscribeSchema } from '../server/schemas/newsletter'
import { COMMENT_LIMITS } from '../app/helpers/comments'

describe('auth schemas', () => {
  it('trims the login identifier and keeps the password as typed', () => {
    expect(loginSchema.parse({ identifier: '  lectora ', password: ' secreto ' })).toEqual({ identifier: 'lectora', password: ' secreto ' })
    expect(loginSchema.safeParse({ identifier: '   ', password: 'x' }).success).toBe(false)
    expect(loginSchema.safeParse({ identifier: 'lectora' }).success).toBe(false)
  })

  it('accepts a registration only with valid fields and the privacy notice accepted', () => {
    const valid = { username: 'lectora', email: ' Lectora@Example.com ', password: 'una-clave-larga', acceptPrivacy: true }
    expect(registerSchema.parse({ ...valid, role: 'admin' })).toEqual({ username: 'lectora', email: 'lectora@example.com', password: 'una-clave-larga', acceptPrivacy: true })
    for (const body of [
      { ...valid, acceptPrivacy: 'true' },
      { ...valid, acceptPrivacy: false },
      { ...valid, username: 'a b' },
      { ...valid, email: 'not-an-email' },
      { ...valid, password: 'corta' },
    ]) {
      expect(registerSchema.safeParse(body).success).toBe(false)
    }
  })

  it('normalizes the email of password and confirmation requests', () => {
    expect(emailSchema.parse({ email: ' Ana@Example.com ' })).toEqual({ email: 'ana@example.com' })
    expect(emailSchema.safeParse({ email: 42 }).success).toBe(false)
  })

  it('requires a code and two matching valid passwords to reset', () => {
    const valid = { code: 'abc', password: 'una-clave-larga', passwordConfirmation: 'una-clave-larga' }
    expect(resetPasswordSchema.safeParse(valid).success).toBe(true)
    expect(resetPasswordSchema.safeParse({ ...valid, passwordConfirmation: 'otra-clave-larga' }).success).toBe(false)
    expect(resetPasswordSchema.safeParse({ ...valid, code: '' }).success).toBe(false)
  })

  it('requires the username and password to delete the account', () => {
    expect(deleteAccountSchema.safeParse({ username: 'lectora', password: 'x' }).success).toBe(true)
    expect(deleteAccountSchema.safeParse({ username: 'lectora' }).success).toBe(false)
  })
})

describe('subscribeSchema', () => {
  it('normalizes the email and maps the locale to a newsletter language', () => {
    expect(subscribeSchema.parse({ email: ' Ana@Example.com ', locale: 'es' })).toEqual({ email: 'ana@example.com', locale: 'es' })
    expect(subscribeSchema.parse({ email: 'ana@example.com', locale: 'fr' }).locale).toBe('en')
    expect(subscribeSchema.parse({ email: 'ana@example.com' }).locale).toBe('en')
  })

  it('tells a missing email from an invalid one', () => {
    for (const body of [{}, { email: '' }, { email: 42 }]) {
      expect(subscribeSchema.safeParse(body).error?.issues[0]?.message).toBe('Email is required')
    }
    for (const body of [{ email: 'not-an-email' }, { email: `${'a'.repeat(250)}@b.co` }]) {
      expect(subscribeSchema.safeParse(body).error?.issues[0]?.message).toBe('Invalid email format')
    }
  })
})

describe('guestCommentSchema', () => {
  const valid = { author: { name: ' Ana ', email: 'Ana@Example.com' }, content: ' Hola ' }

  it('keeps only the allowed fields', () => {
    const result = guestCommentSchema.parse({ ...valid, approvalStatus: 'APPROVED', isAdminComment: true, author: { ...valid.author, id: 'admin' } })
    expect(result).toEqual({ author: { name: 'Ana', email: 'ana@example.com', avatar: undefined }, content: 'Hola', locale: undefined })
  })

  it('keeps an http(s) avatar and a numeric parent, and drops other avatars', () => {
    expect(guestCommentSchema.parse({ ...valid, author: { ...valid.author, avatar: 'https://example.com/a.png' }, threadOf: 7 })).toMatchObject({
      author: { avatar: 'https://example.com/a.png' },
      threadOf: 7,
    })
    expect(guestCommentSchema.parse({ ...valid, author: { ...valid.author, avatar: 'javascript:alert(1)' } }).author.avatar).toBeUndefined()
  })

  it('rejects missing, invalid or oversized fields', () => {
    for (const body of [
      {},
      { ...valid, content: '   ' },
      { ...valid, author: { name: 'Ana' } },
      { ...valid, author: { name: 'Ana', email: 'not-an-email' } },
      { ...valid, author: { name: 'x'.repeat(COMMENT_LIMITS.name + 1), email: 'a@b.co' } },
      { ...valid, content: 'x'.repeat(COMMENT_LIMITS.content + 1) },
      { ...valid, threadOf: '7' },
      { ...valid, threadOf: 0 },
    ]) {
      expect(guestCommentSchema.safeParse(body).success).toBe(false)
    }
  })
})
