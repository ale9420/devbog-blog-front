import type { StrapiBlock } from './strapi-blocks'

export interface StrapiAboutSEO {
  metaTitle: string
  metaDescription: string
  keywords?: string
  metaRobots?: string
  metaViewport?: string
  canonicalURL?: string
}

export interface StrapiAbout {
  id: number
  documentId: string
  title: string
  locale: string
  seo?: StrapiAboutSEO
  blocks: StrapiBlock[]
}
