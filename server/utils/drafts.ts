import type { H3Event } from 'h3'
import type { Locale } from '~/interfaces'
import { isLocale } from '~/helpers/locale'

export function draftNotFound() {
  return createError({ statusCode: 404, statusMessage: 'Not Found' })
}

export function editorSession(event: H3Event): string {
  const jwt = getSessionToken(event)
  if (!jwt) throw draftNotFound()
  return jwt
}

export function draftLocale(event: H3Event): Locale | undefined {
  const locale = getQuery(event).locale
  return isLocale(locale) ? locale : undefined
}

export async function fetchAsEditor<T>(jwt: string, path: string, query: string): Promise<T> {
  try {
    const url = strapiUrl(query ? `${path}?${query}` : path)
    return await $fetch<T>(url, { headers: { Authorization: `Bearer ${jwt}` } }) as T
  } catch (error: unknown) {
    const status = asUpstreamError(error).response?.status
    if (status === 401 || status === 403 || status === 404) throw draftNotFound()
    console.error('Strapi drafts error:', status, upstreamErrorMessage(error, 'unknown'))
    throw createError({ statusCode: 502, statusMessage: 'Failed to fetch drafts' })
  }
}
