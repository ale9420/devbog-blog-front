import { describe, it, expect } from 'vitest'
import { blogQuery, hasActiveFilters, paginationItems, parseBlogQuery, searchTerm } from '../app/helpers/blog'
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
