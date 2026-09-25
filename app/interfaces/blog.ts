import type { Category } from './design'
import type { PostListItem } from './strapi-post'

export type BlogView = 'grid' | 'log'

export type BlogSort = 'recent' | 'oldest' | 'fediverse'

export interface BlogFilters {
  category?: Category
  tag?: string
  search?: string
  page: number
  view?: BlogView
  sort?: BlogSort
  content?: boolean
}

export interface PostMonth {
  key: string
  label: string
  posts: PostListItem[]
}

export type PaginationItem = number | 'gap'

export interface TocHeading {
  id: string
  text: string
  level: 2 | 3
}
