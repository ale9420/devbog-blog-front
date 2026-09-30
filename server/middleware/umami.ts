import { isUmamiProxyPath } from '~/helpers/analytics'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  if (!config.umamiUrl) return
  if (!isUmamiProxyPath(event.path, config.public.umamiScriptPath, config.umamiCollectPath)) return

  const clientIp = getRequestIP(event, { xForwardedFor: true })
  return proxyRequest(event, new URL(event.path, config.umamiUrl).href, {
    headers: clientIp ? { 'x-real-ip': clientIp } : {},
  })
})
