import { BirdToken, Category } from '../interfaces/design'
import type { CategoryInfo } from '../interfaces/design'

export const CATEGORIES: readonly Category[] = [
  Category.Privacidad,
  Category.Diy,
  Category.Ia,
  Category.Software,
  Category.Linux,
]

export const CATEGORY_INFO: Readonly<Record<Category, CategoryInfo>> = {
  [Category.Privacidad]: { token: BirdToken.Pinchaflor, scientificName: 'Diglossa cyanea', pillar: 1 },
  [Category.Diy]: { token: BirdToken.Golondrina, scientificName: 'Pygochelidon cyanoleuca', pillar: 2 },
  [Category.Ia]: { token: BirdToken.Chillon, scientificName: 'Colibri coruscans', pillar: null },
  [Category.Software]: { token: BirdToken.Mirla, scientificName: 'Turdus fuscater', pillar: null },
  [Category.Linux]: { token: BirdToken.Monjita, scientificName: 'Chrysomus icterocephalus bogotensis', pillar: null },
}

export function isCategory(value: unknown): value is Category {
  return typeof value === 'string' && (CATEGORIES as readonly string[]).includes(value)
}

export function categoryOrder(slug: string | null | undefined): number {
  const index = CATEGORIES.indexOf(slug as Category)
  return index === -1 ? CATEGORIES.length : index
}
