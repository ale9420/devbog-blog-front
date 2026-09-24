import { describe, it, expect } from 'vitest'
import { runInNewContext } from 'node:vm'
import { themeInitScript, isTheme } from '~/helpers/theme'

interface Env {
  stored?: Record<string, string>
  prefersLight?: boolean
  storageThrows?: boolean
}

function run({ stored = {}, prefersLight = false, storageThrows = false }: Env): string | undefined {
  const attrs: Record<string, string> = {}
  const localStorage = {
    getItem(key: string): string | null {
      if (storageThrows) throw new Error('blocked')
      return stored[key] ?? null
    },
  }
  runInNewContext(themeInitScript, {
    localStorage,
    matchMedia: (query: string) => ({ matches: query.includes('light') && prefersLight }),
    document: { documentElement: { setAttribute: (k: string, v: string) => { attrs[k] = v } } },
  })
  return attrs['data-theme']
}

describe('themeInitScript', () => {
  it('uses the stored theme', () => {
    expect(run({ stored: { 'devbog-theme': 'dia' } })).toBe('dia')
    expect(run({ stored: { 'devbog-theme': 'noche' }, prefersLight: true })).toBe('noche')
  })

  it('migrates the legacy color mode value', () => {
    expect(run({ stored: { 'devbog-color-mode': 'light' } })).toBe('dia')
    expect(run({ stored: { 'devbog-color-mode': 'dark' }, prefersLight: true })).toBe('noche')
  })

  it('follows the system preference without a stored theme', () => {
    expect(run({ prefersLight: true })).toBe('dia')
    expect(run({ prefersLight: false })).toBe('noche')
    expect(run({ stored: { 'devbog-color-mode': 'system' }, prefersLight: true })).toBe('dia')
    expect(run({ stored: { 'devbog-theme': 'sepia' } })).toBe('noche')
  })

  it('falls back to noche when storage is blocked', () => {
    expect(run({ storageThrows: true, prefersLight: true })).toBe('noche')
  })
})

describe('isTheme', () => {
  it('accepts only noche and dia', () => {
    expect(isTheme('noche')).toBe(true)
    expect(isTheme('dia')).toBe(true)
    expect(isTheme('dark')).toBe(false)
    expect(isTheme(null)).toBe(false)
  })
})
