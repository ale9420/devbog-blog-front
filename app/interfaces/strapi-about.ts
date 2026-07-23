import type { StrapiBlock } from './strapi-blocks'
import type { StrapiSEO } from './strapi-seo'

export type { StrapiSEO as StrapiAboutSEO }

export interface StrapiAbout {
  id: number
  documentId: string
  title: string
  locale: string
  seo?: StrapiSEO
  blocks: StrapiBlock[]
}
