import { isTema, readStoredTema, systemTema } from '~/helpers/theme'

export default defineNuxtPlugin((nuxtApp) => {
  const { sync } = useTheme()

  nuxtApp.hook('app:mounted', () => {
    const current = document.documentElement.getAttribute('data-theme')
    sync(isTema(current) ? current : systemTema())

    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
      if (!readStoredTema()) sync(systemTema())
    })
  })
})
