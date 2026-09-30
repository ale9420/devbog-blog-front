import { umamiScriptAttributes } from '~/helpers/analytics'

export default defineNuxtPlugin(() => {
  const { umamiWebsiteId, umamiScriptPath, siteUrl } = useRuntimeConfig().public
  const script = umamiScriptAttributes({ websiteId: umamiWebsiteId, scriptPath: umamiScriptPath, siteUrl })
  if (script) useHead({ script: [script] })
})
