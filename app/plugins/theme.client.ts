import { isTheme, readStoredTheme, systemTheme } from '~/helpers/theme'

export default defineNuxtPlugin((nuxtApp) => {
  const { sync } = useTheme()

  nuxtApp.hooks.hookOnce('app:suspense:resolve', () => {
    const current = document.documentElement.getAttribute('data-theme')
    sync(isTheme(current) ? current : systemTheme())

    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
      if (!readStoredTheme()) sync(systemTheme())
    })
  })
})
