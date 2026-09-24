import { describe, it, expect } from 'vitest'
import { initials } from '~/helpers/string'

describe('initials', () => {
  it('takes the first letter of up to two words', () => {
    expect(initials('Alejandro Ramírez García')).toBe('AR')
    expect(initials('  ana  ')).toBe('A')
  })

  it('falls back for empty or missing names', () => {
    expect(initials(undefined)).toBe('?')
    expect(initials('   ')).toBe('?')
  })
})
