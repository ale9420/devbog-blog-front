import type { Category } from './design'

export interface BlogFilters {
  category?: Category
  tag?: string
  search?: string
  page: number
}

export type PaginationItem = number | 'gap'
