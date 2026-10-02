import { z } from 'zod'
import { newsletterLanguage } from '~/helpers/newsletter'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_EMAIL_LENGTH = 254
const INVALID_EMAIL = 'Invalid email format'

export const subscribeSchema = z.object({
  email: z.string({ error: 'Email is required' })
    .trim()
    .min(1, 'Email is required')
    .max(MAX_EMAIL_LENGTH, INVALID_EMAIL)
    .regex(EMAIL_PATTERN, INVALID_EMAIL)
    .transform(email => email.toLowerCase()),
  locale: z.unknown().optional().transform(newsletterLanguage),
})
