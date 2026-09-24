import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h } from 'vue'
import BdBird from '~/components/bd/BdBird.vue'
import { useCategoryLabel } from '~/composables/useCategoryLabel'
import { CATEGORIES } from '~/helpers/categories'
import { Category } from '~/interfaces/design'

describe('BdBird', () => {
  it('draws a distinct bird for each category in its color', async () => {
    const drawings = new Set<string>()
    for (const category of CATEGORIES) {
      const wrapper = await mountSuspended(BdBird, { props: { category, size: 160 } })
      const svg = wrapper.get('svg')
      expect(svg.attributes('aria-hidden')).toBe('true')
      expect(svg.attributes('width')).toBe('160')
      expect(svg.attributes('height')).toBe('120')
      expect(svg.attributes('style')).toContain('var(--')
      expect(svg.findAll('path').length).toBeGreaterThan(3)
      drawings.add(svg.html())
    }
    expect(drawings.size).toBe(5)
  })
})

describe('useCategoryLabel', () => {
  it('translates known slugs and falls back to the Strapi name', async () => {
    let label: ReturnType<typeof useCategoryLabel> = () => ''
    await mountSuspended(defineComponent({
      setup() {
        label = useCategoryLabel()
        return () => h('div')
      },
    }))
    expect(label({ slug: Category.Ai, name: 'Inteligencia artificial' })).toBe('Artificial intelligence')
    expect(label({ slug: Category.Diy })).toBe('DIY · Do it yourself')
    expect(label({ slug: null, name: 'Tech culture' })).toBe('Tech culture')
    expect(label(null)).toBe('')
  })
})
