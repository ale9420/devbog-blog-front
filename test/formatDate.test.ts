import { describe, it, expect } from 'vitest'
import { formatDate } from '~/helpers/formatDate'

describe('formatDate', () => {
  it('returns empty string for null/undefined', () => {
    expect(formatDate(undefined)).toBe('')
    expect(formatDate(null)).toBe('')
  })

  it('formats full style in en-US by default', () => {
    expect(formatDate('2026-07-23T16:35:05.045Z')).toMatch(/July 23, 2026/)
  })

  it('formats full style in es-CO when locale passed', () => {
    expect(formatDate('2026-07-23T16:35:05.045Z', 'full', 'es-CO')).toMatch(/23 de julio de 2026/)
  })

  it('omits the year in abbreviated style', () => {
    expect(formatDate('2026-07-23T16:35:05.045Z', 'abbreviated')).not.toMatch(/2026/)
  })
})
