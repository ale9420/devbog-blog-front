import { resetPasswordSchema } from '../../schemas/auth'

export default defineEventHandler(async (event): Promise<{ ok: true }> => {
  preventCaching(event)
  assertSameOrigin(event)
  const { code, password, passwordConfirmation } = await validBody(event, resetPasswordSchema, () => authFailure('invalidInput'))

  try {
    await $fetch(strapiUrl('/api/auth/reset-password'), {
      method: 'POST',
      body: { code, password, passwordConfirmation },
    })
  } catch (error: unknown) {
    throw strapiAuthFailure(error, { invalidInput: 'invalidCode' })
  }
  return { ok: true }
})
