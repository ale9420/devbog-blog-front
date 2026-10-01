import type { Locale } from '~/interfaces'
import { localizedPath } from '~/helpers/locale'

export default defineNuxtRouteMiddleware(async (to) => {
  const user = await useAuth().ensure()
  if (user) return
  const locale = useNuxtApp().$i18n.locale.value as Locale
  return navigateTo({ path: localizedPath('/account/sign-in', locale), query: { redirect: to.fullPath } })
})
