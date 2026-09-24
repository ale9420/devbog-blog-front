import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BdButton from '~/components/bd/BdButton.vue'

describe('BdButton', () => {
  it('renders a primary button by default', async () => {
    const wrapper = await mountSuspended(BdButton, { slots: { default: () => 'Leer' } })
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('type')).toBe('button')
    expect(wrapper.classes()).toEqual(['bd-btn', 'bd-btn-primary'])
    expect(wrapper.find('.bd-btn-arrow').exists()).toBe(false)
  })

  it('applies variant, size, type and arrow', async () => {
    const wrapper = await mountSuspended(BdButton, {
      props: { variant: 'accent', size: 'sm', type: 'submit', arrow: true },
      slots: { default: () => 'Suscribirme' },
    })
    expect(wrapper.attributes('type')).toBe('submit')
    expect(wrapper.classes()).toContain('bd-btn-accent')
    expect(wrapper.classes()).toContain('bd-btn-sm')
    expect(wrapper.get('.bd-btn-arrow').attributes('aria-hidden')).toBe('true')
  })

  it('renders a link when href is given', async () => {
    const wrapper = await mountSuspended(BdButton, {
      props: { href: '/blog', variant: 'secondary' },
      slots: { default: () => 'Blog' },
    })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('/blog')
    expect(wrapper.classes()).toContain('bd-btn-secondary')
  })

  it('emits native clicks and respects disabled', async () => {
    const clicks: number[] = []
    const wrapper = await mountSuspended(BdButton, {
      props: { onClick: () => clicks.push(1) },
      attrs: { disabled: true },
      slots: { default: () => 'Enviar' },
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
    await wrapper.trigger('click')
    expect(clicks).toHaveLength(0)
  })
})
