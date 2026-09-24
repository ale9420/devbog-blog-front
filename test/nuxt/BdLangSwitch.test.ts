import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BdLangSwitch from '~/components/bd/BdLangSwitch.vue'

describe('BdLangSwitch', () => {
  it('is a labelled group with the current language pressed', async () => {
    const wrapper = await mountSuspended(BdLangSwitch)
    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.attributes('aria-label')).toBe('Language')
    const buttons = wrapper.findAll('button')
    expect(buttons.map(b => b.text())).toEqual(['ES', 'EN'])
    expect(buttons.map(b => b.attributes('lang'))).toEqual(['es', 'en'])
    expect(buttons.map(b => b.attributes('aria-label'))).toEqual(['Español', 'English'])
    expect(buttons.map(b => b.attributes('aria-pressed'))).toEqual(['false', 'true'])
  })

  it('ignores the current language', async () => {
    const wrapper = await mountSuspended(BdLangSwitch)
    await wrapper.findAll('button')[1]!.trigger('click')
    expect(wrapper.emitted('change')).toBeUndefined()
  })
})
