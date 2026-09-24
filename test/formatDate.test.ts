import { describe, it, expect } from 'vitest'
import { formatDate, formatDotDate } from '~/helpers/formatDate'

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

describe('formatDotDate', () => {
  it('returns empty string for null/undefined', () => {
    expect(formatDotDate(undefined)).toBe('')
    expect(formatDotDate(null)).toBe('')
  })

  it('formats as DD.MM.YYYY', () => {
    expect(formatDotDate('2026-09-23T16:35:05.045Z')).toBe('23.09.2026')
  })

  it('uses Bogotá time', () => {
    expect(formatDotDate('2026-09-24T02:00:00.000Z')).toBe('23.09.2026')
  })
})
