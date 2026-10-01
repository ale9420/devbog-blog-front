import type { H3Event } from 'h3'
import type { RateLimitRule } from '~/helpers/rateLimit'
import { createRateLimiter } from '~/helpers/rateLimit'

const limiter = createRateLimiter()

export const RATE_LIMITS = {
  commentPerIp: { limit: 10, windowMs: 10 * 60 * 1000 },
  newsletterPerIp: { limit: 10, windowMs: 60 * 60 * 1000 },
  newsletterPerEmail: { limit: 3, windowMs: 60 * 60 * 1000 },
} satisfies Record<string, RateLimitRule>

export function clientIp(event: H3Event): string {
  return getRequestIP(event, { xForwardedFor: true }) || 'unknown'
}

export function assertRateLimit(event: H3Event, bucket: keyof typeof RATE_LIMITS, key: string): void {
  const result = limiter.consume(`${bucket}:${key}`, RATE_LIMITS[bucket])
  if (result.allowed) return
  setHeader(event, 'Retry-After', result.retryAfterSeconds)
  throw createError({ statusCode: 429, statusMessage: 'Too Many Requests' })
}
