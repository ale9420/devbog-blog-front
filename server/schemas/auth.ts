import { z } from 'zod'
import { isValidEmail, isValidPassword, isValidUsername } from '~/helpers/auth'

const email = z.string().trim().toLowerCase().refine(isValidEmail)
const password = z.string().refine(isValidPassword)
const filled = z.string().min(1)

export const loginSchema = z.object({
  identifier: z.string().trim().min(1),
  password: filled,
})

export const registerSchema = z.object({
  username: z.string().trim().refine(isValidUsername),
  email,
  password,
  acceptPrivacy: z.literal(true),
})

export const emailSchema = z.object({ email })

export const resetPasswordSchema = z.object({
  code: filled,
  password,
  passwordConfirmation: z.string(),
}).refine(input => input.password === input.passwordConfirmation)

export const deleteAccountSchema = z.object({
  username: filled,
  password: filled,
})
