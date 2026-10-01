import { isValidEmail } from '~/helpers/auth'

export default defineEventHandler(async (event): Promise<{ ok: true }> => {
  preventCaching(event)
  assertSameOrigin(event)
  const body = await readAuthBody<{ email: string }>(event)
  const email = bodyString(body.email).trim().toLowerCase()
  if (!isValidEmail(email)) throw authFailure('invalidInput')

  try {
    await $fetch(strapiAuthUrl(event, '/api/auth/send-email-confirmation'), { method: 'POST', body: { email } })
  } catch (error: unknown) {
    if (asUpstreamError(error).response?.status === 429) throw authFailure('tooManyRequests')
    console.error('Strapi send-email-confirmation error:', asUpstreamError(error).data?.error?.message || error)
  }
  return { ok: true }
})
