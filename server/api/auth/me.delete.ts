import type { StrapiAuthUser } from '~/interfaces/auth'
import { deleteAccountSchema } from '../../schemas/auth'

export default defineEventHandler(async (event): Promise<{ ok: true }> => {
  preventCaching(event)
  assertSameOrigin(event)
  const jwt = getSessionToken(event)
  if (!jwt) throw authFailure('unauthorized')

  const { username, password } = await validBody(event, deleteAccountSchema, () => authFailure('invalidInput'))

  let user: StrapiAuthUser
  try {
    user = await fetchStrapiMe(jwt)
  } catch (error: unknown) {
    const failure = strapiAuthFailure(error)
    if (failure.statusCode === 401) clearSessionCookie(event)
    throw failure
  }
  if (user.username !== username) throw authFailure('invalidInput')

  try {
    await $fetch(strapiUrl('/api/users/me'), {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${jwt}` },
      body: { password },
    })
  } catch (error: unknown) {
    throw strapiAuthFailure(error, { invalidInput: 'wrongPassword', invalidCredentials: 'wrongPassword' })
  }

  clearSessionCookie(event)
  return { ok: true }
})
