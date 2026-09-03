import type { StrapiBlock } from './strapi-blocks'
import type { StrapiSEO } from './strapi-seo'

export interface StrapiPost {
  id: number
  documentId: string
  title: string
  slug: string
  description: string
  content: string
  publishedAt: string
  readTime?: number
  tags?: string[] | null
  cover?: {
    url: string
    alternativeText?: string
  }
  category?: {
    id: number
    name: string
  }
  author?: {
    id: number
    name: string
    avatar?: {
      url: string
      alternativeText?: string
    }
  }
  seo?: StrapiSEO
  blocks: StrapiBlock[]
}

export interface PostListItem {
  id: number
  title: string
  slug: string
  description: string
  publishedAt: string
  readTime?: number
  tags?: string[] | null
  cover?: {
    url: string
    alternativeText?: string
  }
  category?: {
    id: number
    name: string
  }
  author?: {
    id: number
    name: string
    avatar?: {
      url: string
      alternativeText?: string
    }
  }
  seo?: StrapiSEO
}
