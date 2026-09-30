import { OUTBOUND_LINK_EVENT, outboundLinkUrl, type UmamiTracker } from '~/helpers/analytics'

export default defineNuxtPlugin(() => {
  if (!useRuntimeConfig().public.umamiWebsiteId) return

  document.addEventListener(
    'click',
    (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href]')
      if (!link) return
      const url = outboundLinkUrl(link.getAttribute('href') ?? '', window.location.origin)
      if (!url) return
      const tracker = (window as Window & { umami?: UmamiTracker }).umami
      tracker?.track(OUTBOUND_LINK_EVENT, { url })
    },
    { capture: true },
  )
})
