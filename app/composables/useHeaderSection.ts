import type { Ref } from 'vue'

export function useHeaderSection(): Ref<string> {
  return useState<string>('bd-header-section', () => '')
}
