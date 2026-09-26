import { describe, it, expect, vi, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import HomeFediverse from '~/components/home/Fediverse.vue'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('HomeFediverse', () => {
  it('shows the configured handle and announces the copy', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    const wrapper = await mountSuspended(HomeFediverse)
    expect(wrapper.attributes('id')).toBe('fediverso')
    expect(wrapper.get('.bd-fedi-handle').text()).toBe('@bogdev@api.bogdev.com.co')
    await wrapper.get('.bd-fedi-copy button').trigger('click')
    await flushPromises()
    expect(writeText).toHaveBeenCalledWith('@bogdev@api.bogdev.com.co')
    expect(wrapper.get('.bd-fedi-copy button').text()).toBe('Copied ✓')
    expect(wrapper.get('.bd-fedi-copy [aria-live="polite"]').text()).toBe('@bogdev@api.bogdev.com.co copied')
  })

  it('explains invalid instances and opens the follow flow for valid ones', async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null)
    const wrapper = await mountSuspended(HomeFediverse)
    const input = wrapper.get('input')
    const hint = (): string => wrapper.get('#bd-fedi-hint').text()

    await wrapper.get('form').trigger('submit')
    expect(hint()).toContain('Type your instance')
    expect(input.attributes('aria-invalid')).toBe('true')

    await input.setValue('mastodon social')
    await wrapper.get('form').trigger('submit')
    expect(hint()).toContain('does not look like a domain')
    expect(open).not.toHaveBeenCalled()

    await input.setValue('https://Fosstodon.org/@ana')
    expect(hint()).toBe('fosstodon.org will open to confirm')
    expect(input.attributes('aria-invalid')).toBeUndefined()
    await wrapper.get('form').trigger('submit')
    expect(open).toHaveBeenCalledWith(
      'https://fosstodon.org/authorize_interaction?uri=https%3A%2F%2Fapi.bogdev.com.co%2Ffediverse%2Fuser%2Fdevbog',
      '_blank',
      'noopener,noreferrer',
    )
    expect((input.element as HTMLInputElement).value).toBe('fosstodon.org')
  })

  it('lists the three steps', async () => {
    const wrapper = await mountSuspended(HomeFediverse)
    expect(wrapper.findAll('.bd-fedi-step-title').map(step => step.text())).toEqual(['Follow', 'Read it in your timeline', 'Reply, like or boost'])
    expect(wrapper.get('.bd-fedi-step-text').text()).toContain('@bogdev@api.bogdev.com.co')
  })
})
