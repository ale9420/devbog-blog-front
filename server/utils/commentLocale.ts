import { Locale } from '~/interfaces/locale'

const COMMENT_LOCALES = new Set<string>(Object.values(Locale))

export function commentLocale(value: unknown): Locale | undefined {
  if (value === undefined || value === null || value === '') return undefined
  if (typeof value === 'string' && COMMENT_LOCALES.has(value)) return value as Locale
  throw createError({
    statusCode: 400,
    message: 'Unsupported locale'
  })
}
