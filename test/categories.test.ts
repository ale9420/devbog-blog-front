import { describe, it, expect } from 'vitest'
import { BirdToken, Category } from '~/interfaces/design'
import { CATEGORIES, CATEGORY_INFO, categoryOrder, isCategory } from '~/helpers/categories'

describe('categories', () => {
  it('lists the five categories with the pillars first', () => {
    expect(CATEGORIES).toEqual([Category.Privacidad, Category.Diy, Category.Ia, Category.Software, Category.Linux])
    expect(CATEGORY_INFO[Category.Privacidad].pillar).toBe(1)
    expect(CATEGORY_INFO[Category.Diy].pillar).toBe(2)
    expect(CATEGORY_INFO[Category.Ia].pillar).toBeNull()
  })

  it('keeps the enum values equal to the Strapi slugs', () => {
    expect(Object.values(Category)).toEqual(['privacidad', 'diy', 'ia', 'software', 'linux'])
  })

  it('maps each category to its bird token', () => {
    expect(Object.fromEntries(CATEGORIES.map((c) => [c, CATEGORY_INFO[c].token]))).toEqual({
      [Category.Privacidad]: BirdToken.Pinchaflor,
      [Category.Diy]: BirdToken.Golondrina,
      [Category.Ia]: BirdToken.Chillon,
      [Category.Software]: BirdToken.Mirla,
      [Category.Linux]: BirdToken.Monjita,
    })
  })

  it('recognizes only known slugs', () => {
    expect(isCategory(Category.Diy)).toBe(true)
    expect(isCategory('DIY')).toBe(false)
    expect(isCategory('tutorial')).toBe(false)
    expect(isCategory(null)).toBe(false)
  })

  it('orders known categories first and unknown ones last', () => {
    expect(categoryOrder(Category.Privacidad)).toBe(0)
    expect(categoryOrder(Category.Linux)).toBe(4)
    expect(categoryOrder('tutorial')).toBe(5)
    expect(categoryOrder(null)).toBe(5)
  })
})
