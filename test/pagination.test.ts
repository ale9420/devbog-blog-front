import { describe, expect, it } from 'vitest'
import { MAX_PAGE_SIZE, parsePagination } from '../app/helpers/pagination'

describe('parsePagination', () => {
  it('uses the defaults when nothing is sent', () => {
    expect(parsePagination({}, 10)).toEqual({ page: 1, pageSize: 10 })
    expect(parsePagination({ page: '', pageSize: '' }, 6)).toEqual({ page: 1, pageSize: 6 })
  })

  it('reads positive integers from the query', () => {
    expect(parsePagination({ page: '3', pageSize: '24' }, 10)).toEqual({ page: 3, pageSize: 24 })
  })

  it('caps the page size', () => {
    expect(parsePagination({ pageSize: '10000' }, 10)).toEqual({ page: 1, pageSize: MAX_PAGE_SIZE })
  })

  it('rejects anything that is not a positive integer', () => {
    for (const query of [{ page: '0' }, { page: '-1' }, { page: 'abc' }, { pageSize: '1.5' }, { pageSize: 'NaN' }, { pageSize: '1e3' }, { page: ['1', '2'] }]) {
      expect(parsePagination(query, 10)).toBeNull()
    }
  })
})
