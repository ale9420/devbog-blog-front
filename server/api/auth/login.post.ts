import type { AuthUserResponse, LoginInput, StrapiAuthUser } from '~/interfaces/auth'
import { toPublicUser } from '~/helpers/auth'

export default defineEventHandler(async (event): Promise<AuthUserResponse> => {
  preventCaching(event)
  assertSameOrigin(event)
  const body = await readAuthBody<LoginInput>(event)
  const identifier = bodyString(body.identifier).trim()
  const password = bodyString(body.password)
  if (!identifier || !password) throw authFailure('invalidInput')

  let jwt: string
  try {
    const response = await $fetch<{ jwt: string, user: StrapiAuthUser }>(strapiAuthUrl(event, '/api/auth/local'), {
      method: 'POST',
      body: { identifier, password },
    })
    jwt = response.jwt
  } catch (error: unknown) {
    throw strapiAuthFailure(error, { invalidInput: 'invalidCredentials' })
  }

  try {
    const user = await fetchStrapiMe(event, jwt)
    setSessionCookie(event, jwt)
    return { user: toPublicUser(user) }
  } catch (error: unknown) {
    throw strapiAuthFailure(error)
  }
})
