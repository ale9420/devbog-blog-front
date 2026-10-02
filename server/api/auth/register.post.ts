import type { AuthUserResponse, RegisterInput, StrapiAuthUser } from '~/interfaces/auth'
import { isValidEmail, isValidPassword, isValidUsername, toPublicUser } from '~/helpers/auth'

export default defineEventHandler(async (event): Promise<AuthUserResponse> => {
  preventCaching(event)
  assertSameOrigin(event)
  const body = await readAuthBody<RegisterInput>(event)
  const username = bodyString(body.username).trim()
  const email = bodyString(body.email).trim().toLowerCase()
  const password = bodyString(body.password)
  if (!isValidUsername(username) || !isValidEmail(email) || !isValidPassword(password) || body.acceptPrivacy !== true) {
    throw authFailure('invalidInput')
  }

  try {
    const response = await $fetch<{ user: StrapiAuthUser }>(strapiUrl('/api/auth/local/register'), {
      method: 'POST',
      body: { username, email, password },
    })
    setResponseStatus(event, 201)
    return { user: toPublicUser(response.user) }
  } catch (error: unknown) {
    throw strapiAuthFailure(error)
  }
})
