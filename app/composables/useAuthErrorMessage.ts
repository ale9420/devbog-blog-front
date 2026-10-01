import type { AuthErrorCode } from '~/interfaces'
import { authErrorCodeOf } from '~/helpers/auth'

const MESSAGE_CODES: readonly AuthErrorCode[] = [
  'invalidCredentials',
  'emailNotConfirmed',
  'emailTaken',
  'tooManyRequests',
  'invalidCode',
  'wrongPassword',
]

export function useAuthErrorMessage(): (err: unknown) => string {
  const { t } = useI18n()

  return function errorMessage(err: unknown): string {
    const code = authErrorCodeOf(err)
    return t(`account.errors.${MESSAGE_CODES.includes(code) ? code : 'unknown'}`)
  }
}
