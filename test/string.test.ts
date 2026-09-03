import { describe, it, expect } from 'vitest'
import { getInitial } from '~/helpers/string'

describe('getInitial', () => {
  it('uppercases the first character', () => {
    expect(getInitial('alejandro')).toBe('A')
  })

  it('falls back for empty or missing names', () => {
    expect(getInitial(undefined)).toBe('?')
    expect(getInitial('')).toBe('?')
    expect(getInitial(undefined, 'A')).toBe('A')
  })
})
