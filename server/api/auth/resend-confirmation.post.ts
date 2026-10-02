import { emailSchema } from '../../schemas/auth'

export default defineEventHandler(async (event): Promise<{ ok: true }> => {
  preventCaching(event)
  assertSameOrigin(event)
  const { email } = await validBody(event, emailSchema, () => authFailure('invalidInput'))

  try {
    await $fetch(strapiUrl('/api/auth/send-email-confirmation'), { method: 'POST', body: { email } })
  } catch (error: unknown) {
    if (asUpstreamError(error).response?.status === 429) throw authFailure('tooManyRequests')
    console.error('Strapi send-email-confirmation error:', asUpstreamError(error).data?.error?.message || error)
  }
  return { ok: true }
})
