import type { AuthUserResponse, StrapiAuthUser } from '~/interfaces/auth'
import { toPublicUser } from '~/helpers/auth'
import { registerSchema } from '../../schemas/auth'

export default defineEventHandler(async (event): Promise<AuthUserResponse> => {
  preventCaching(event)
  assertSameOrigin(event)
  const { username, email, password } = await validBody(event, registerSchema, () => authFailure('invalidInput'))

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
