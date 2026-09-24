import { isTheme, readStoredTheme, systemTheme } from '~/helpers/theme'

export default defineNuxtPlugin((nuxtApp) => {
  const { sync } = useTheme()

  nuxtApp.hook('app:mounted', () => {
    const current = document.documentElement.getAttribute('data-theme')
    sync(isTheme(current) ? current : systemTheme())

    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
      if (!readStoredTheme()) sync(systemTheme())
    })
  })
})
