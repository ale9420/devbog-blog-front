export type StrapiReferenceType =
  | 'journal'
  | 'conference'
  | 'preprint'
  | 'book'
  | 'chapter'
  | 'web'
  | 'software'
  | 'docs'

export interface StrapiReference {
  id?: number
  key: string
  type: StrapiReferenceType
  authors: string
  year: string
  title: string
  container?: string | null
  volume?: string | null
  issue?: string | null
  pages?: string | null
  venueLabel?: string | null
  doi?: string | null
  url?: string | null
  accessedAt?: string | null
}

export interface NumberedReference {
  number: number
  cited: boolean
  reference: StrapiReference
}

export interface BlockCitations {
  numbers: Readonly<Record<string, number>>
  anchored: readonly string[]
}

export interface CitationIndex {
  numbers: Readonly<Record<string, number>>
  anchors: Readonly<Record<string, string[]>>
}

export type ApaSegmentKind = 'text' | 'title' | 'container'

export interface ApaSegment {
  kind: ApaSegmentKind
  text: string
  href?: string
}

export interface ReferenceIdentifier {
  text: string
  href: string
}
