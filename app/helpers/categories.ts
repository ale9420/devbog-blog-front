import type { Category, CategoryInfo } from '../interfaces/design'

export const CATEGORIES: readonly Category[] = ['privacidad', 'diy', 'ia', 'software', 'linux']

export const CATEGORY_INFO: Readonly<Record<Category, CategoryInfo>> = {
  privacidad: { token: 'pinchaflor', scientificName: 'Diglossa cyanea', pillar: 1 },
  diy: { token: 'golondrina', scientificName: 'Pygochelidon cyanoleuca', pillar: 2 },
  ia: { token: 'chillon', scientificName: 'Colibri coruscans', pillar: null },
  software: { token: 'mirla', scientificName: 'Turdus fuscater', pillar: null },
  linux: { token: 'monjita', scientificName: 'Chrysomus icterocephalus bogotensis', pillar: null },
}

export function isCategory(value: unknown): value is Category {
  return typeof value === 'string' && (CATEGORIES as readonly string[]).includes(value)
}

export function categoryOrder(slug: string | null | undefined): number {
  const index = CATEGORIES.indexOf(slug as Category)
  return index === -1 ? CATEGORIES.length : index
}
