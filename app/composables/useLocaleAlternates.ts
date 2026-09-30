import type { LocaleAlternates, LocalePaths } from '~/interfaces'

export interface LocaleAlternatesState {
  alternates: Ref<LocaleAlternates | null>
  setAlternates: (paths: LocalePaths) => void
}

export function useLocaleAlternates(): LocaleAlternatesState {
  const route = useRoute()
  const alternates = useState<LocaleAlternates | null>('locale-alternates', () => null)

  function setAlternates(paths: LocalePaths): void {
    alternates.value = { path: route.path, paths }
  }

  return { alternates, setAlternates }
}
