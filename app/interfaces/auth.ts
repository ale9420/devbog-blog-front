export type AuthRole = 'reader' | 'editor'

export interface AuthUser {
  username: string
  email: string
  role: AuthRole
  createdAt: string | null
}

export interface AuthUserResponse {
  user: AuthUser | null
}

export type AuthErrorCode =
  | 'invalidCredentials'
  | 'emailNotConfirmed'
  | 'emailTaken'
  | 'tooManyRequests'
  | 'invalidCode'
  | 'wrongPassword'
  | 'invalidInput'
  | 'unauthorized'
  | 'forbiddenOrigin'
  | 'unknown'

export type AuthNotice = 'signed-out' | 'account-deleted' | 'password-reset'

export type PasswordStrength = 0 | 1 | 2 | 3 | 4

export interface LoginInput {
  identifier: string
  password: string
}

export interface RegisterInput {
  username: string
  email: string
  password: string
  acceptPrivacy: boolean
}

export interface ResetPasswordInput {
  code: string
  password: string
  passwordConfirmation: string
}

export interface DeleteAccountInput {
  username: string
  password: string
}

export interface StrapiAuthUser {
  id: number
  username: string
  email: string
  confirmed?: boolean
  blocked?: boolean
  createdAt?: string
  role?: { type?: string | null } | null
}
