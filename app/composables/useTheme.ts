import type { ComputedRef } from 'vue'
import type { Tema } from '~/interfaces'
import { storeTema } from '~/helpers/theme'

export interface UseTheme {
  tema: ComputedRef<Tema>
  isDark: ComputedRef<boolean>
  setTema: (next: Tema, origin?: EventTarget | null) => void
  toggle: (origin?: EventTarget | null) => void
  sync: (next: Tema) => void
}

export function useTheme(): UseTheme {
  const state = useState<Tema>('bd-tema', () => 'noche')

  const tema = computed<Tema>(() => state.value)
  const isDark = computed<boolean>(() => state.value === 'noche')

  function sync(next: Tema): void {
    document.documentElement.setAttribute('data-theme', next)
    state.value = next
  }

  function setTema(next: Tema, origin?: EventTarget | null): void {
    if (import.meta.server) return
    storeTema(next)

    const root = document.documentElement
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduceMotion) {
      sync(next)
      return
    }

    if (origin instanceof Element) {
      const rect = origin.getBoundingClientRect()
      root.style.setProperty('--vt-x', `${rect.left + rect.width / 2}px`)
      root.style.setProperty('--vt-y', `${rect.top + rect.height / 2}px`)
    }

    root.classList.add('bd-vt-tema')
    const transition = document.startViewTransition(() => sync(next))
    transition.finished.finally(() => root.classList.remove('bd-vt-tema'))
  }

  function toggle(origin?: EventTarget | null): void {
    setTema(isDark.value ? 'dia' : 'noche', origin)
  }

  return { tema, isDark, setTema, toggle, sync }
}
