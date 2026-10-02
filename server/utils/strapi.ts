import type { NitroFetchOptions } from 'nitropack'

export type StrapiFetchOptions = Pick<NitroFetchOptions<string>, 'method' | 'query' | 'body' | 'timeout'>

export function strapiUrl(path: string): string {
  return `${useRuntimeConfig().public.strapiUrl.replace(/\/+$/, '')}${path}`
}

function apiTokenHeaders(): Record<string, string> {
  const token = useRuntimeConfig().strapiApiToken
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function strapiFetch<T>(path: string, options: StrapiFetchOptions = {}): Promise<T> {
  return $fetch<T>(strapiUrl(path), { ...options, headers: apiTokenHeaders() }) as Promise<T>
}
