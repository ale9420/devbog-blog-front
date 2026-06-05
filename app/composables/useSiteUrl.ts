/**
 * Shared site URL singleton.
 * Reads from `config.public.siteUrl` and falls back to `https://bogdev.com.co`.
 * Use this everywhere instead of inlining `config.public.siteUrl` to keep the
 * fallback consistent across pages.
 */
export function useSiteUrl() {
  const config = useRuntimeConfig()

  const siteUrl = computed(() => config.public.siteUrl || 'https://bogdev.com.co')

  return { siteUrl }
}
