import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { Category } from '~/interfaces'
import BlogFilters from '~/components/blog/Filters.vue'

const baseProps = {
  total: 3,
  counts: { [Category.Software]: 2, [Category.Linux]: 1 },
  tags: ['Vue', 'Linux'],
  search: '',
}

describe('BlogFilters', () => {
  it('renders category and tag chips with aria-pressed', async () => {
    const wrapper = await mountSuspended(BlogFilters, {
      props: { ...baseProps, filters: { category: Category.Software, page: 1 } },
    })
    const categories = wrapper.get('[role="group"][aria-label="Filter by category"]').findAll('button')
    expect(categories.map(chip => chip.text())).toEqual(['All03', 'Privacy00', 'DIY00', 'AI00', 'Software02', 'Linux01'])
    expect(categories.map(chip => chip.attributes('aria-pressed'))).toEqual(['false', 'false', 'false', 'false', 'true', 'false'])
    const tags = wrapper.get('[role="group"][aria-label="Filter by tag"]').findAll('button')
    expect(tags.map(chip => chip.text())).toEqual(['#Vue', '#Linux'])
    await categories[0]!.trigger('click')
    await tags[0]!.trigger('click')
    expect(wrapper.emitted('category')).toEqual([[undefined]])
    expect(wrapper.emitted('tag')).toEqual([['Vue']])
  })

  it('shows removable active filters and the search count', async () => {
    const wrapper = await mountSuspended(BlogFilters, {
      props: { ...baseProps, search: 'vue', resultCount: 1, filters: { tag: 'Vue', search: 'vue', page: 1 } },
    })
    expect(wrapper.get('.bd-blog-search-count').text()).toBe('01 result')
    expect(wrapper.get('.bd-blog-hint').text()).toBe('3 letters minimum · searches titles only for now')
    const active = wrapper.findAll('.bd-blog-active-chip')
    expect(active.map(chip => chip.attributes('aria-label'))).toEqual(['Remove filter #Vue', 'Remove filter «vue»'])
    await active[1]!.trigger('click')
    await wrapper.get('.bd-blog-textbtn').trigger('click')
    expect(wrapper.emitted('remove')).toEqual([['search']])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('updates the search model as the reader types', async () => {
    const wrapper = await mountSuspended(BlogFilters, { props: { ...baseProps, filters: { page: 1 } } })
    await wrapper.get('input[type="search"]').setValue('linux')
    expect(wrapper.emitted('update:search')).toEqual([['linux']])
    expect(wrapper.find('.bd-blog-active').exists()).toBe(false)
  })
})
