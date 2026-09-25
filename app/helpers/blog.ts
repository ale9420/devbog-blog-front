import type { LocationQuery } from 'vue-router'
import type { BlogFilters, BlogView, PaginationItem, PostMonth } from '../interfaces/blog'
import type { PostListItem } from '../interfaces/strapi-post'
import { isCategory } from './categories'
import { MIN_SEARCH_LENGTH } from './search'

export const BLOG_PAGE_SIZE = 6
export const LOG_PAGE_SIZE = 24

const LOG_VIEW = 'log'
const TIME_ZONE = 'America/Bogota'

function firstValue(value: LocationQuery[string] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value
  return typeof raw === 'string' ? raw.trim() : ''
}

export function searchTerm(input: string): string | undefined {
  const term = input.trim()
  return term.length >= MIN_SEARCH_LENGTH ? term : undefined
}

export function parseBlogQuery(query: LocationQuery): BlogFilters {
  const category = firstValue(query.category).toLowerCase()
  const tag = firstValue(query.tag)
  const page = Number.parseInt(firstValue(query.page), 10)
  return {
    category: isCategory(category) ? category : undefined,
    tag: tag || undefined,
    search: searchTerm(firstValue(query.search)),
    page: Number.isFinite(page) && page > 1 ? page : 1,
    view: parseView(firstValue(query.view)),
  }
}

function parseView(value: string): BlogView | undefined {
  return value.toLowerCase() === LOG_VIEW ? 'log' : undefined
}

export function blogPageSize(view: BlogView | undefined): number {
  return view === 'log' ? LOG_PAGE_SIZE : BLOG_PAGE_SIZE
}

export function blogQuery(filters: BlogFilters): Record<string, string> {
  const query: Record<string, string> = {}
  if (filters.category) query.category = filters.category
  if (filters.tag) query.tag = filters.tag
  if (filters.search) query.search = filters.search
  if (filters.page > 1) query.page = String(filters.page)
  if (filters.view === 'log') query.view = LOG_VIEW
  return query
}

function monthKey(date: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', timeZone: TIME_ZONE }).formatToParts(new Date(date))
  const part = (type: Intl.DateTimeFormatPartTypes): string => parts.find(item => item.type === type)?.value ?? ''
  return `${part('year')}-${part('month')}`
}

function monthLabel(key: string, locale: string): string {
  const [year, month] = key.split('-').map(Number)
  const name = new Intl.DateTimeFormat(locale, { month: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(year!, month! - 1, 15)))
  return `${name} ${year}`
}

export function groupPostsByMonth(posts: PostListItem[], locale: string): PostMonth[] {
  const months = new Map<string, PostListItem[]>()
  for (const post of posts) {
    if (!post.publishedAt) continue
    const key = monthKey(post.publishedAt)
    months.set(key, [...(months.get(key) ?? []), post])
  }
  return Array.from(months, ([key, items]) => ({ key, label: monthLabel(key, locale), posts: items }))
}

export function hasActiveFilters(filters: BlogFilters): boolean {
  return Boolean(filters.category || filters.tag || filters.search)
}

export function paginationItems(current: number, total: number): PaginationItem[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)
  const items: PaginationItem[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) items.push('gap')
  for (let page = start; page <= end; page++) items.push(page)
  if (end < total - 1) items.push('gap')
  items.push(total)
  return items
}
