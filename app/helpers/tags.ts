import type { StrapiTagRef, TagCount } from '../interfaces/strapi-post'

export function sortTags(tags: TagCount[]): TagCount[] {
  return [...tags].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

export function popularTags(tags: TagCount[], limit: number, active?: string): TagCount[] {
  const top = tags.slice(0, limit)
  if (!active || top.some(tag => tag.slug === active)) return top
  const current = tags.find(tag => tag.slug === active)
  return current ? [...top, current] : top
}

export function tagLabel(tags: StrapiTagRef[], slug: string): string {
  return tags.find(tag => tag.slug === slug)?.name ?? slug
}
