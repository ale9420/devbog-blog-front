import { missingRuntimeSettings } from '~/helpers/runtimeConfig'

export default defineNitroPlugin(() => {
  if (import.meta.dev) return
  const missing = missingRuntimeSettings(useRuntimeConfig())
  if (missing.length) {
    console.warn(`Missing runtime settings: ${missing.join(', ')}. Set them with these NUXT_* names; plain names are ignored.`)
  }
})
