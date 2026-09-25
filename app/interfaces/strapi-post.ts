import type { StrapiBlock } from './strapi-blocks'
import type { StrapiSEO } from './strapi-seo'

export interface StrapiMediaRef {
  id?: number
  documentId?: string
  url: string
  alternativeText?: string | null
  width?: number
  height?: number
}

export interface StrapiCategoryRef {
  id?: number
  documentId?: string
  name?: string
  slug?: string | null
}

export interface StrapiAuthorRef {
  id?: number
  documentId?: string
  name?: string
  avatar?: StrapiMediaRef | null
}

export interface RawStrapiArticle {
  id: number
  documentId: string
  title: string
  slug: string
  description?: string | null
  content?: string | null
  publishedAt?: string | null
  updatedAt?: string | null
  createdAt?: string | null
  locale?: string | null
  readTime?: number | null
  tags?: string[] | null
  cover?: StrapiMediaRef | null
  category?: StrapiCategoryRef | null
  author?: StrapiAuthorRef | null
  seo?: StrapiSEO | null
  snippet?: string | null
  blocks?: StrapiBlock[] | null
}

export interface PostListItem {
  id: number
  documentId?: string
  title: string
  slug: string
  description?: string | null
  publishedAt?: string | null
  readTime?: number | null
  tags?: string[] | null
  cover?: StrapiMediaRef | null
  category?: StrapiCategoryRef | null
  author?: StrapiAuthorRef | null
  seo?: StrapiSEO | null
  snippet?: string | null
}

export type SearchMatch = 'title' | 'description' | 'content'

export interface SearchPostResult {
  documentId: string
  title: string
  slug: string
  description: string | null
  publishedAt: string | null
  category: { name: string | null; slug: string | null } | null
  matchedIn: SearchMatch
  snippet: string
}

export interface StrapiPost {
  id: number
  documentId: string
  title: string
  slug: string
  description?: string | null
  content?: string | null
  publishedAt?: string | null
  readTime?: number | null
  tags?: string[] | null
  cover?: StrapiMediaRef | null
  category?: StrapiCategoryRef | null
  author?: StrapiAuthorRef | null
  seo?: StrapiSEO
  blocks: StrapiBlock[]
}
