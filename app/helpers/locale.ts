import type { LocationQuery } from 'vue-router'
import { defaultLocale, Locale } from '~/interfaces/locale'

const PER_LOCALE_PARAMS = new Set<string>(['page'])
const LOCALES = new Set<string>(Object.values(Locale))

export function localeSwitchQuery(query: LocationQuery): LocationQuery {
  return Object.fromEntries(Object.entries(query).filter(([key]) => !PER_LOCALE_PARAMS.has(key)))
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && LOCALES.has(value)
}

export function localizedPath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  if (locale === defaultLocale) return clean
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`
}
