import { createHash } from 'node:crypto'
import { contentSecurityPolicy, inlineScripts } from '~/helpers/securityHeaders'

function sha256(content: string): string {
  return createHash('sha256').update(content).digest('base64')
}

export default defineNitroPlugin((nitroApp) => {
  if (import.meta.dev) return
  nitroApp.hooks.hook('render:html', (html, { event }) => {
    const config = useRuntimeConfig(event)
    const document = [...html.head, ...html.bodyPrepend, ...html.body, ...html.bodyAppend].join('')
    setResponseHeader(event, 'content-security-policy', contentSecurityPolicy({
      scriptHashes: inlineScripts(document).map(sha256),
      imageOrigins: [config.public.strapiUrl, config.mediaUrl],
    }))
  })
})
