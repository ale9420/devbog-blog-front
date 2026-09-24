import { describe, it, expect } from 'vitest'
import { cycleIndex, matchesQuery, normalizeText, padCount } from '~/helpers/search'

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
