export enum Category {
  Privacidad = 'privacidad',
  Diy = 'diy',
  Ia = 'ia',
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

export type LogoVariant = 'auto' | 'color' | 'blanco' | 'negro'

export type CalloutTone = 'nota' | 'aviso' | 'peligro'

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
