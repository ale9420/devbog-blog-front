import type { DraftListResponse } from '~/interfaces'

interface UseDraftCount {
  count: Ref<number | null>
  refresh: () => Promise<void>
}

export function useDraftCount(): UseDraftCount {
  const count = useState<number | null>('draft-count', () => null)

  async function refresh(): Promise<void> {
    try {
      const response = await $fetch<DraftListResponse>('/api/drafts')
      count.value = response.meta.count
    } catch {
      count.value = null
    }
  }

  return { count, refresh }
}
