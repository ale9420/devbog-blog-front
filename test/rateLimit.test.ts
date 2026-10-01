import { describe, expect, it } from 'vitest'
import { createRateLimiter } from '../app/helpers/rateLimit'

const rule = { limit: 2, windowMs: 60_000 }

describe('createRateLimiter', () => {
  it('allows up to the limit inside the window and reports when to retry', () => {
    const limiter = createRateLimiter()
    expect(limiter.consume('ip', rule, 0).allowed).toBe(true)
    expect(limiter.consume('ip', rule, 1_000).allowed).toBe(true)
    expect(limiter.consume('ip', rule, 30_000)).toEqual({ allowed: false, retryAfterSeconds: 30 })
  })

  it('counts each key on its own', () => {
    const limiter = createRateLimiter()
    limiter.consume('a', rule, 0)
    limiter.consume('a', rule, 0)
    expect(limiter.consume('a', rule, 0).allowed).toBe(false)
    expect(limiter.consume('b', rule, 0).allowed).toBe(true)
  })

  it('starts a new window once the previous one ends', () => {
    const limiter = createRateLimiter()
    for (let i = 0; i < 3; i++) limiter.consume('ip', rule, 0)
    expect(limiter.consume('ip', rule, 60_000).allowed).toBe(true)
  })
})
