export enum Category {
  Privacy = 'privacidad',
  Diy = 'diy',
  Ai = 'ia',
  Software = 'software',
  Linux = 'linux',
}

export enum BirdToken {
  Pinchaflor = 'pinchaflor',
  Golondrina = 'golondrina',
  Chillon = 'chillon',
  Mirla = 'mirla',
  Monjita = 'monjita',
}

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'text'

export type ButtonSize = 'md' | 'sm'

export type LogoVariant = 'auto' | 'color' | 'white' | 'black'

export type CalloutTone = 'note' | 'warning' | 'danger'

export interface CodeLine {
  prompt: boolean
  text: string
}

export interface LogoPath {
  part: 'a' | 'b'
  d: string
}

export interface CategoryInfo {
  token: BirdToken
  scientificName: string
  pillar: 1 | 2 | null
}

export interface CategoryCount {
  id: number
  slug: string | null
  name: string
  count: number
}

export interface CategoryLike {
  name?: string | null
  slug?: string | null
}

export type NewsletterStatus = 'idle' | 'success' | 'error'

export interface NewsletterResult {
  status: NewsletterStatus
  message: string
  invalid: boolean
}

export interface PostCardProps {
  title: string
  href: string
  excerpt?: string
  category?: Category
  date?: string
  dateTime?: string
  author?: string
  readTime?: string
  image?: string
  imageAlt?: string
}

export type HeaderSection = 'home' | 'blog' | 'about'
