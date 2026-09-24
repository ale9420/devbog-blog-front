export interface ResolvedLink {
  href: string
  external: boolean
}

const EXTERNAL = /^(https?:|mailto:)/i

export function resolveLink(url: string, localize: (path: string) => string): ResolvedLink {
  const trimmed = url.trim()
  if (EXTERNAL.test(trimmed)) return { href: trimmed, external: true }
  if (trimmed.startsWith('/')) return { href: localize(trimmed), external: false }
  return { href: trimmed, external: false }
}
