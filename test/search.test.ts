import { describe, it, expect } from 'vitest'
import { cycleIndex, highlightSegments, isContentSearch, matchesQuery, normalizeText, padCount } from '~/helpers/search'

describe('normalizeText', () => {
  it('lowercases, trims and strips accents', () => {
    expect(normalizeText('  Inteligencia Artificial ')).toBe('inteligencia artificial')
    expect(normalizeText('Código Ñandú')).toBe('codigo nandu')
  })
})

describe('matchesQuery', () => {
  it('matches everything for an empty query', () => {
    expect(matchesQuery('Linux', '')).toBe(true)
    expect(matchesQuery('Linux', '   ')).toBe(true)
  })

  it('ignores case and accents', () => {
    expect(matchesQuery('Linux y código abierto', 'CODIGO')).toBe(true)
    expect(matchesQuery('Privacidad', 'privac')).toBe(true)
    expect(matchesQuery('Privacidad', 'linux')).toBe(false)
  })
})

describe('cycleIndex', () => {
  it('starts at the first or last option', () => {
    expect(cycleIndex(-1, 4, 1)).toBe(0)
    expect(cycleIndex(-1, 4, -1)).toBe(3)
  })

  it('wraps around in both directions', () => {
    expect(cycleIndex(3, 4, 1)).toBe(0)
    expect(cycleIndex(0, 4, -1)).toBe(3)
    expect(cycleIndex(1, 4, 1)).toBe(2)
  })

  it('returns -1 when there are no options', () => {
    expect(cycleIndex(0, 0, 1)).toBe(-1)
  })
})

describe('padCount', () => {
  it('pads to two digits', () => {
    expect(padCount(2)).toBe('02')
    expect(padCount(12)).toBe('12')
  })
})

describe('highlightSegments', () => {
  it('marks every case-insensitive match and keeps the original text', () => {
    expect(highlightSegments('RAG explained: rag in practice', 'rag')).toEqual([
      { text: 'RAG', match: true },
      { text: ' explained: ', match: false },
      { text: 'rag', match: true },
      { text: ' in practice', match: false },
    ])
  })

  it('returns the whole text when there is nothing to mark', () => {
    expect(highlightSegments('Linux hardening', 'vue')).toEqual([{ text: 'Linux hardening', match: false }])
    expect(highlightSegments('Linux hardening', '  ')).toEqual([{ text: 'Linux hardening', match: false }])
    expect(highlightSegments('', 'vue')).toEqual([])
  })

  it('keeps markup as plain text', () => {
    expect(highlightSegments('<img src=x onerror=alert(1)> vue', 'vue')).toEqual([
      { text: '<img src=x onerror=alert(1)> ', match: false },
      { text: 'vue', match: true },
    ])
  })
})

describe('isContentSearch', () => {
  it('accepts 1 and true only', () => {
    expect(isContentSearch('1')).toBe(true)
    expect(isContentSearch('true')).toBe(true)
    expect(isContentSearch(['1'])).toBe(true)
    expect(isContentSearch('0')).toBe(false)
    expect(isContentSearch(undefined)).toBe(false)
  })
})
