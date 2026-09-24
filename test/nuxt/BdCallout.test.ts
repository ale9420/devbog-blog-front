import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BdCallout from '~/components/bd/BdCallout.vue'

describe('BdCallout', () => {
  it('defaults to a note with its translated label', async () => {
    const wrapper = await mountSuspended(BdCallout, { slots: { default: () => 'Texto' } })
    expect(wrapper.attributes('role')).toBe('note')
    expect(wrapper.classes()).toContain('bd-callout-nota')
    expect(wrapper.get('.bd-callout-label').text()).toBe('◆ Note')
    expect(wrapper.get('.bd-callout-body').text()).toBe('Texto')
  })

  it('uses role alert and a custom title for danger', async () => {
    const wrapper = await mountSuspended(BdCallout, {
      props: { tone: 'peligro', title: 'Borra datos' },
      slots: { default: () => 'Cuidado' },
    })
    expect(wrapper.attributes('role')).toBe('alert')
    expect(wrapper.classes()).toContain('bd-callout-peligro')
    expect(wrapper.get('.bd-callout-label').text()).toBe('✕ Borra datos')
  })
})
