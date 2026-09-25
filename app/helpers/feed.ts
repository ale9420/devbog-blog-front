import type { Category } from '../interfaces/design'

export function feedPath(locale: string, category?: Category): string {
  const prefix = locale === 'es' ? '/es' : ''
  return `${prefix}${category ? `/feed/${category}.xml` : '/feed.xml'}`
}
