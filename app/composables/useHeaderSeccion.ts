import type { Ref } from 'vue'

export function useHeaderSeccion(): Ref<string> {
  return useState<string>('bd-header-seccion', () => '')
}
