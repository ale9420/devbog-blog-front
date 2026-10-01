import type { RawStrapiArticle } from './strapi-post'

export type DraftState = 'never-published' | 'modified'

export type DraftViewState = DraftState | 'unchanged'

export type DraftFilter = 'all' | DraftState

export interface DraftListItem {
  documentId: string
  title: string
  slug: string | null
  locale: string
  updatedAt: string
  publishedAt: string | null
  state: DraftState
  category: { name?: string | null, slug?: string | null } | null
  author: { name?: string | null } | null
}

export interface DraftListResponse {
  data: DraftListItem[]
  meta: { count: number }
}

export interface PublishedVersion {
  slug: string
  updatedAt: string | null
  publishedAt: string | null
}

export interface DraftArticleResponse {
  article: RawStrapiArticle
  published: PublishedVersion | null
}
