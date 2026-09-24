import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { getQuery } from 'h3'
import BdSearchPalette from '~/components/bd/BdSearchPalette.vue'

const searches: Record<string, unknown>[] = []

registerEndpoint('/api/search', (event) => {
  const query = getQuery(event)
  searches.push(query)
  if (query.q === 'nada que ver') return []
  return [
    { id: 1, title: 'Understanding Vue Composables', slug: 'understanding-vue-composables', description: null, publishedAt: '2026-02-01T10:00:00.000Z', cover: null, category: { name: 'Software', slug: 'software' } },
  ]
})

registerEndpoint('/api/categories', () => [
  { id: 1, slug: 'software', name: 'Software', count: 2 },
  { id: 2, slug: 'linux', name: 'Linux', count: 1 },
])

async function mountOpen() {
  const wrapper = await mountSuspended(BdSearchPalette, { props: { open: false } })
  await wrapper.setProps({ open: true })
  return wrapper
}

function labels(wrapper: Awaited<ReturnType<typeof mountOpen>>): string[] {
  return wrapper.findAll('[role="option"] .bd-result-label').map(node => node.text())
}

describe('BdSearchPalette', () => {
  beforeEach(() => {
    searches.length = 0
    useTheme().sync('noche')
  })

  it('opens as a modal combobox with topics and actions', async () => {
    const wrapper = await mountOpen()
    expect((wrapper.get('dialog').element as HTMLDialogElement).open).toBe(true)
    const input = wrapper.get('input')
    expect(input.attributes('role')).toBe('combobox')
    expect(input.attributes('aria-controls')).toBe('bd-palette-list')
    expect(input.attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('label').attributes('for')).toBe(input.attributes('id'))
    expect(wrapper.get('#bd-palette-list').attributes('role')).toBe('listbox')
    expect(wrapper.findAll('[role="group"]').map(group => group.get('.bd-palette-heading').text())).toEqual(['Topics', 'Actions'])
    expect(labels(wrapper)).toEqual([
      'Privacy', 'DIY · Do it yourself', 'Artificial intelligence', 'Software development', 'Linux and open source',
      'Switch to the Day theme', 'Follow on the fediverse',
    ])
    await vi.waitFor(() => expect(wrapper.get('#topic-software .bd-result-hint').text()).toBe('02'))
    expect(wrapper.get('.bd-palette-note').text()).toBe('Type 3 or more letters to search articles')
  })

  it('filters topics locally without calling the API for short queries', async () => {
    const wrapper = await mountOpen()
    await wrapper.get('input').setValue('ux')
    expect(labels(wrapper)).toEqual(['Linux and open source', 'Switch to the Day theme', 'Follow on the fediverse'])
    expect(searches).toHaveLength(0)
  })

  it('searches articles with the locale and announces the result count', async () => {
    const wrapper = await mountOpen()
    await wrapper.get('input').setValue('composables')
    expect(wrapper.get('.bd-palette-note').text()).toBe('Searching…')
    await vi.waitFor(() => expect(wrapper.find('#article-1').exists()).toBe(true), { timeout: 2000 })
    expect(searches).toEqual([{ q: 'composables', locale: 'en' }])
    expect(wrapper.get('#article-1 .bd-result-label').text()).toBe('Understanding Vue Composables')
    expect(wrapper.get('#article-1 .bd-result-hint').text()).toBe('01.02.2026')
    expect(wrapper.get('[role="status"]').text()).toBe('1 result')
    expect(wrapper.get('[role="status"]').attributes('aria-live')).toBe('polite')
  })

  it('shows the empty state', async () => {
    const wrapper = await mountOpen()
    await wrapper.get('input').setValue('nada que ver')
    await vi.waitFor(() => expect(wrapper.find('.bd-palette-note').text()).toBe('No results for “nada que ver”'), { timeout: 2000 })
    expect(wrapper.get('[role="status"]').text()).toBe('No results for “nada que ver”')
    expect(labels(wrapper)).toEqual(['Switch to the Day theme', 'Follow on the fediverse'])
  })

  it('moves the active option with the arrows and runs the theme action with Enter', async () => {
    const wrapper = await mountOpen()
    const input = wrapper.get('input')
    expect(input.attributes('aria-activedescendant')).toBeUndefined()
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(input.attributes('aria-activedescendant')).toBe('topic-privacidad')
    expect(wrapper.get('#topic-privacidad').attributes('aria-selected')).toBe('true')
    await input.trigger('keydown', { key: 'ArrowUp' })
    await input.trigger('keydown', { key: 'ArrowUp' })
    expect(input.attributes('aria-activedescendant')).toBe('action-theme')
    await input.trigger('keydown', { key: 'Enter' })
    expect(document.documentElement.getAttribute('data-theme')).toBe('dia')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('closes with Esc, the Esc button and the backdrop, and resets when closed', async () => {
    const wrapper = await mountOpen()
    await wrapper.get('dialog').trigger('cancel')
    await wrapper.get('.bd-palette-esc').trigger('click')
    await wrapper.get('dialog').trigger('click')
    await wrapper.get('.bd-palette-panel').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(3)

    await wrapper.get('input').setValue('li')
    await wrapper.setProps({ open: false })
    expect((wrapper.get('dialog').element as HTMLDialogElement).open).toBe(false)
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('')
  })
})
