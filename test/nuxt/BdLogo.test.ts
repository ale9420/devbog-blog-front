import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BdLogo from '~/components/bd/BdLogo.vue'

describe('BdLogo', () => {
  it('renders the mark with the official proportions and label', async () => {
    const wrapper = await mountSuspended(BdLogo, { props: { size: 40 } })
    const svg = wrapper.get('svg')
    expect(svg.attributes('width')).toBe('52')
    expect(svg.attributes('height')).toBe('40')
    expect(svg.attributes('role')).toBe('img')
    expect(svg.attributes('aria-label')).toBe('BogDev')
    expect(wrapper.findAll('path.bd-logo-a')).toHaveLength(2)
    expect(wrapper.findAll('path.bd-logo-b')).toHaveLength(2)
    expect(wrapper.classes()).toContain('bd-logo-auto')
  })

  it('hides the mark from assistive tech when the wordmark is shown', async () => {
    const wrapper = await mountSuspended(BdLogo, { props: { size: 40, variant: 'blanco', wordmark: true } })
    expect(wrapper.get('svg').attributes('aria-hidden')).toBe('true')
    expect(wrapper.get('svg').attributes('role')).toBeUndefined()
    expect(wrapper.get('.bd-logo-word').text()).toBe('BogDev')
    expect(wrapper.attributes('style')).toContain('font-size: 22px')
    expect(wrapper.classes()).toContain('bd-logo-blanco')
  })
})
