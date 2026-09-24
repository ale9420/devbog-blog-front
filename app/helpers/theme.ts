import type { Tema } from '../interfaces/theme'

export const THEME_STORAGE_KEY = 'devbog-theme'
export const LEGACY_THEME_STORAGE_KEY = 'devbog-color-mode'

export const themeInitScript = `(function(){var d=document.documentElement,t;try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');if(s!=='noche'&&s!=='dia'){s={dark:'noche',light:'dia'}[localStorage.getItem('${LEGACY_THEME_STORAGE_KEY}')]}t=s||(matchMedia('(prefers-color-scheme: light)').matches?'dia':'noche')}catch(e){t='noche'}d.setAttribute('data-theme',t)})()`

export function isTema(value: unknown): value is Tema {
  return value === 'noche' || value === 'dia'
}

export function readStoredTema(): Tema | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return isTema(stored) ? stored : null
  } catch {
    return null
  }
}

export function storeTema(tema: Tema): boolean {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, tema)
    localStorage.removeItem(LEGACY_THEME_STORAGE_KEY)
    return true
  } catch {
    return false
  }
}

export function systemTema(): Tema {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'dia' : 'noche'
}
