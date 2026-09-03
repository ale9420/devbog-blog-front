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
  readTime?: number | null
  tags?: string[] | null
  cover?: StrapiMediaRef | null
  category?: StrapiCategoryRef | null
  author?: StrapiAuthorRef | null
  seo?: StrapiSEO | null
  blocks?: StrapiBlock[] | null
}

export interface PostListItem {
  id: number
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
}

export interface SearchPostResult {
  id: number
  title: string
  slug: string
  description?: string | null
  cover: { url: string } | null
  category: { name: string } | null
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
