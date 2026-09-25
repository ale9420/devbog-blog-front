import { describe, it, expect } from 'vitest'
import { BLOG_PAGE_SIZE, LOG_PAGE_SIZE, blogPageSize, blogQuery, groupPostsByMonth, hasActiveFilters, paginationItems, parseBlogQuery, parseSort, searchTerm } from '../app/helpers/blog'
import type { PostListItem } from '../app/interfaces/strapi-post'
import { Category } from '../app/interfaces/design'

describe('parseBlogQuery', () => {
  it('reads filters from the URL and drops invalid values', () => {
    expect(parseBlogQuery({ category: 'Linux', tag: 'Vue', search: '  vue  ', page: '3' })).toEqual({
      category: Category.Linux,
      tag: 'Vue',
      search: 'vue',
      page: 3,
    })
    expect(parseBlogQuery({ category: 'unknown', search: 'vu', page: '-2' })).toEqual({
      category: undefined,
      tag: undefined,
      search: undefined,
      page: 1,
    })
  })

  it('takes the first value of repeated params', () => {
    expect(parseBlogQuery({ tag: ['AI', 'Linux'] }).tag).toBe('AI')
  })

  it('reads the log view and ignores unknown views', () => {
    expect(parseBlogQuery({ view: 'log' }).view).toBe('log')
    expect(parseBlogQuery({ view: 'LOG' }).view).toBe('log')
    expect(parseBlogQuery({ view: 'grid' }).view).toBeUndefined()
    expect(parseBlogQuery({ view: 'timeline' }).view).toBeUndefined()
  })
})

describe('blogQuery', () => {
  it('omits empty filters and the first page', () => {
    expect(blogQuery({ page: 1 })).toEqual({})
    expect(blogQuery({ category: Category.Ai, tag: 'RAG', search: 'llm', page: 2 })).toEqual({
      category: 'ia',
      tag: 'RAG',
      search: 'llm',
      page: '2',
    })
  })
})

describe('blog views', () => {
  it('keeps the log view in the URL and leaves the grid as default', () => {
    expect(blogQuery({ page: 1, view: 'log' })).toEqual({ view: 'log' })
    expect(blogQuery({ page: 2, view: 'grid' })).toEqual({ page: '2' })
  })

  it('does not count the view as a filter', () => {
    expect(hasActiveFilters({ page: 1, view: 'log' })).toBe(false)
  })

  it('shows more posts per page in the log', () => {
    expect(blogPageSize('log')).toBe(LOG_PAGE_SIZE)
    expect(blogPageSize('grid')).toBe(BLOG_PAGE_SIZE)
    expect(blogPageSize(undefined)).toBe(BLOG_PAGE_SIZE)
  })
})

describe('blog sort', () => {
  it('reads the sort from the URL and falls back to recent', () => {
    expect(parseBlogQuery({ sort: 'oldest' }).sort).toBe('oldest')
    expect(parseBlogQuery({ sort: 'Fediverse' }).sort).toBe('fediverse')
    expect(parseBlogQuery({ sort: 'recent' }).sort).toBeUndefined()
    expect(parseBlogQuery({ sort: 'popular' }).sort).toBeUndefined()
    expect(parseSort(undefined)).toBeUndefined()
    expect(parseSort(['oldest'])).toBeUndefined()
  })

  it('keeps only non-default sorts in the URL', () => {
    expect(blogQuery({ page: 1, sort: 'oldest' })).toEqual({ sort: 'oldest' })
    expect(blogQuery({ page: 1, sort: 'fediverse', view: 'log' })).toEqual({ sort: 'fediverse', view: 'log' })
    expect(blogQuery({ page: 1, sort: 'recent' })).toEqual({})
  })

  it('does not count the sort as a filter', () => {
    expect(hasActiveFilters({ page: 1, sort: 'fediverse' })).toBe(false)
  })
})

describe('groupPostsByMonth', () => {
  function post(id: number, publishedAt: string | null): PostListItem {
    return { id, title: `Post ${id}`, slug: `post-${id}`, publishedAt }
  }

  const posts = [
    post(1, '2026-10-01T03:00:00.000Z'),
    post(2, '2026-09-12T10:00:00.000Z'),
    post(3, '2026-08-20T10:00:00.000Z'),
    post(4, null),
  ]

  it('groups posts by month in Bogotá time, keeping their order', () => {
    const months = groupPostsByMonth(posts, 'en')
    expect(months.map(month => month.key)).toEqual(['2026-09', '2026-08'])
    expect(months[0]!.posts.map(item => item.id)).toEqual([1, 2])
    expect(months[1]!.posts.map(item => item.id)).toEqual([3])
  })

  it('names the months in the active language', () => {
    expect(groupPostsByMonth(posts, 'en').map(month => month.label)).toEqual(['September 2026', 'August 2026'])
    expect(groupPostsByMonth(posts, 'es').map(month => month.label)).toEqual(['septiembre 2026', 'agosto 2026'])
  })
})

describe('searchTerm', () => {
  it('needs at least three letters', () => {
    expect(searchTerm(' vu ')).toBeUndefined()
    expect(searchTerm(' vue ')).toBe('vue')
  })
})

describe('hasActiveFilters', () => {
  it('ignores the page number', () => {
    expect(hasActiveFilters({ page: 4 })).toBe(false)
    expect(hasActiveFilters({ tag: 'Vue', page: 1 })).toBe(true)
  })
})

describe('paginationItems', () => {
  it('lists every page up to seven', () => {
    expect(paginationItems(1, 1)).toEqual([1])
    expect(paginationItems(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('collapses distant pages into gaps', () => {
    expect(paginationItems(1, 10)).toEqual([1, 2, 'gap', 10])
    expect(paginationItems(5, 10)).toEqual([1, 'gap', 4, 5, 6, 'gap', 10])
    expect(paginationItems(10, 10)).toEqual([1, 'gap', 9, 10])
  })
})
