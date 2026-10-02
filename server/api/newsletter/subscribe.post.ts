import { randomUUID } from 'crypto'
import { sendConfirmationEmail } from '../../utils/email'
import { createSubscriber, deleteSubscriber, findSubscriber, newUnsubscribeToken } from '../../utils/subscribers'
import { newsletterLanguage } from '~/helpers/newsletter'
import type { NewsletterLanguage, SubscribeRequest, SubscribeResponse } from '~/interfaces/newsletter'

const MAX_EMAIL_LENGTH = 254

function successResponse(language: NewsletterLanguage): SubscribeResponse {
  return {
    success: true,
    message:
      language === 'es'
        ? 'Revisa tu correo para confirmar la suscripción'
        : 'Check your email to confirm subscription',
  }
}

export default defineEventHandler(async (event): Promise<SubscribeResponse> => {
  assertSameOrigin(event)
  const body = await readBody<Partial<SubscribeRequest> | null>(event).catch(() => null)
  const rawEmail = typeof body?.email === 'string' ? body.email.trim() : ''

  if (!rawEmail) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email is required',
    })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (rawEmail.length > MAX_EMAIL_LENGTH || !emailRegex.test(rawEmail)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email format',
    })
  }

  const email = rawEmail.toLowerCase()
  const language = newsletterLanguage(body?.locale)
  assertRateLimit(event, 'newsletterPerIp', clientIp(event))
  assertRateLimit(event, 'newsletterPerEmail', email)

  try {
    const existing = await findSubscriber('email', email)
    if (existing?.confirmed) return successResponse(language)
    if (existing) await deleteSubscriber(existing.documentId)

    const confirmationToken = randomUUID()
    await createSubscriber({
      email,
      confirmationToken,
      unsubscribeToken: newUnsubscribeToken(),
      confirmed: false,
      language,
    })

    await sendConfirmationEmail(email, confirmationToken, language)

    return successResponse(language)
  } catch (error: unknown) {
    console.error('Newsletter subscription error:', error)
    throw createError({
      statusCode: 500,
      statusMessage:
        language === 'es'
          ? 'Error al procesar la suscripción'
          : 'Error processing subscription',
    })
  }
})
