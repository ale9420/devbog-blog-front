import { describe, it, expect } from 'vitest'
import { CATEGORIES, CATEGORY_INFO, categoryOrder, isCategory } from '~/helpers/categories'

describe('categories', () => {
  it('lists the five categories with the pillars first', () => {
    expect(CATEGORIES).toEqual(['privacidad', 'diy', 'ia', 'software', 'linux'])
    expect(CATEGORY_INFO.privacidad.pillar).toBe(1)
    expect(CATEGORY_INFO.diy.pillar).toBe(2)
    expect(CATEGORY_INFO.ia.pillar).toBeNull()
  })

  it('maps each category to its bird token', () => {
    expect(Object.fromEntries(CATEGORIES.map((c) => [c, CATEGORY_INFO[c].token]))).toEqual({
      privacidad: 'pinchaflor',
      diy: 'golondrina',
      ia: 'chillon',
      software: 'mirla',
      linux: 'monjita',
    })
  })

  it('recognizes only known slugs', () => {
    expect(isCategory('diy')).toBe(true)
    expect(isCategory('DIY')).toBe(false)
    expect(isCategory('tutorial')).toBe(false)
    expect(isCategory(null)).toBe(false)
  })

  it('orders known categories first and unknown ones last', () => {
    expect(categoryOrder('privacidad')).toBe(0)
    expect(categoryOrder('linux')).toBe(4)
    expect(categoryOrder('tutorial')).toBe(5)
    expect(categoryOrder(null)).toBe(5)
  })
})
