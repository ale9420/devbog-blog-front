import type { HeaderSection } from '../interfaces/design'

const LOCALE_PREFIX = /^\/(en|es)(?=\/|$)/

function stripLocale(path: string): string {
  const bare = path.replace(LOCALE_PREFIX, '').replace(/\/+$/, '')
  return bare || '/'
}

export function headerSection(path: string): HeaderSection | undefined {
  const bare = stripLocale(path)
  if (bare === '/') return 'inicio'
  if (bare === '/blog' || bare.startsWith('/blog/')) return 'blog'
  if (bare === '/about' || bare.startsWith('/about/')) return 'acerca'
  return undefined
}

export function isReadingPath(path: string): boolean {
  return /^\/blog\/[^/]+$/.test(stripLocale(path))
}

export function readingPercent(scrollTop: number, scrollHeight: number, viewportHeight: number): number {
  const max = scrollHeight - viewportHeight
  if (max <= 0) return 0
  return Math.round(Math.min(100, Math.max(0, (scrollTop / max) * 100)))
}
