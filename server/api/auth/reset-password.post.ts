import type { ResetPasswordInput } from '~/interfaces/auth'
import { isValidPassword } from '~/helpers/auth'

export default defineEventHandler(async (event): Promise<{ ok: true }> => {
  preventCaching(event)
  assertSameOrigin(event)
  const body = await readAuthBody<ResetPasswordInput>(event)
  const code = bodyString(body.code)
  const password = bodyString(body.password)
  const passwordConfirmation = bodyString(body.passwordConfirmation)
  if (!code || !isValidPassword(password) || password !== passwordConfirmation) throw authFailure('invalidInput')

  try {
    await $fetch(strapiAuthUrl(event, '/api/auth/reset-password'), {
      method: 'POST',
      body: { code, password, passwordConfirmation },
    })
  } catch (error: unknown) {
    throw strapiAuthFailure(error, { invalidInput: 'invalidCode' })
  }
  return { ok: true }
})
