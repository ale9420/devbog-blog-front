import { describe, expect, it } from 'vitest'
import { isLocale, localeSwitchQuery, localizedPath } from '~/helpers/locale'
import { Locale } from '~/interfaces/locale'

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

describe('isLocale', () => {
  it('accepts only the supported languages', () => {
    expect(isLocale('en')).toBe(true)
    expect(isLocale('es')).toBe(true)
    expect(isLocale('fr')).toBe(false)
    expect(isLocale(undefined)).toBe(false)
  })
})

describe('localizedPath', () => {
  it('keeps the default language without a prefix', () => {
    expect(localizedPath('/blog/what-is-solarpunk', Locale.English)).toBe('/blog/what-is-solarpunk')
    expect(localizedPath('/', Locale.English)).toBe('/')
  })

  it('prefixes the other languages', () => {
    expect(localizedPath('/blog/que-es-solarpunk', Locale.SpanishColombia)).toBe('/es/blog/que-es-solarpunk')
    expect(localizedPath('/', Locale.SpanishColombia)).toBe('/es')
    expect(localizedPath('blog', Locale.SpanishColombia)).toBe('/es/blog')
  })
})
