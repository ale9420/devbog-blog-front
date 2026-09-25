import type { Ref } from 'vue'
import { READ_THRESHOLD, readRatio } from '~/helpers/readArticles'

export function useMarkAsRead(target: Ref<HTMLElement | null>, documentId: Ref<string | undefined>): void {
  const { isRead, markRead } = useReadArticles()
  let frame: number | null = null

  function check(): void {
    frame = null
    const id = documentId.value
    const element = target.value
    if (!id || !element || isRead(id)) return
    const rect = element.getBoundingClientRect()
    if (readRatio(rect.top, rect.height, window.innerHeight) >= READ_THRESHOLD) markRead(id)
  }

  function onScroll(): void {
    if (frame !== null) return
    frame = requestAnimationFrame(check)
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    watch(documentId, onScroll, { immediate: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    if (frame !== null) cancelAnimationFrame(frame)
  })
}
