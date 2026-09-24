import type { LocationQuery } from 'vue-router'
import type { BlogFilters, PaginationItem } from '../interfaces/blog'
import { isCategory } from './categories'
import { MIN_SEARCH_LENGTH } from './search'

export const BLOG_PAGE_SIZE = 6

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
  }
}

export function blogQuery(filters: BlogFilters): Record<string, string> {
  const query: Record<string, string> = {}
  if (filters.category) query.category = filters.category
  if (filters.tag) query.tag = filters.tag
  if (filters.search) query.search = filters.search
  if (filters.page > 1) query.page = String(filters.page)
  return query
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
