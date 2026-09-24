import type { Theme } from '../interfaces/theme'

export const THEME_STORAGE_KEY = 'devbog-theme'
export const LEGACY_THEME_STORAGE_KEY = 'devbog-color-mode'

export const themeInitScript = `(function(){var d=document.documentElement,t;try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');if(s!=='noche'&&s!=='dia'){s={dark:'noche',light:'dia'}[localStorage.getItem('${LEGACY_THEME_STORAGE_KEY}')]}t=s||(matchMedia('(prefers-color-scheme: light)').matches?'dia':'noche')}catch(e){t='noche'}d.setAttribute('data-theme',t)})()`

export function isTheme(value: unknown): value is Theme {
  return value === 'noche' || value === 'dia'
}

export function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(stored) ? stored : null
  } catch {
    return null
  }
}

export function storeTheme(theme: Theme): boolean {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
    localStorage.removeItem(LEGACY_THEME_STORAGE_KEY)
    return true
  } catch {
    return false
  }
}

export function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'dia' : 'noche'
}
