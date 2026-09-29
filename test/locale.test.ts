import { describe, expect, it } from 'vitest'
import { localeSwitchQuery } from '~/helpers/locale'

describe('localeSwitchQuery', () => {
  it('keeps the filters that mean the same in every language', () => {
    const query = { category: 'software', tag: 'llm', sort: 'fediverse', view: 'log', content: '1', search: 'rag' }
    expect(localeSwitchQuery(query)).toEqual(query)
  })

  it('drops the page, since the other language may have fewer pages', () => {
    expect(localeSwitchQuery({ tag: 'llm', page: '3' })).toEqual({ tag: 'llm' })
  })

  it('keeps repeated values as they are', () => {
    expect(localeSwitchQuery({ tag: ['llm', 'ia'], page: ['2'] })).toEqual({ tag: ['llm', 'ia'] })
  })
})
