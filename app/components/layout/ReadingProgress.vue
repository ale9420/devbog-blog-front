<script setup lang="ts">
const route = useRoute()
const progress = ref(0)
let rafId: number | null = null

const isBlogPost = computed(() => {
  return route.path.startsWith('/blog/') || route.path.startsWith('/es/blog/')
})

function updateProgress() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  progress.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
}

function onScroll() {
  if (rafId !== null) return
  rafId = requestAnimationFrame(() => {
    updateProgress()
    rafId = null
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  updateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
  }
})
</script>

<template>
  <div 
    v-if="isBlogPost"
    class="fixed top-0 left-0 h-1 bg-[var(--primary)] z-[100] transition-all duration-150 ease-out"
    :style="{ width: `${progress}%` }"
  />
</template>
