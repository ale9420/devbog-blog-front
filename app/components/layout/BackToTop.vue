<script setup lang="ts">
const { t } = useI18n()
const { y: scrollY } = useWindowScroll()
const isVisible = computed(() => scrollY.value > 400)

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <Transition name="fade">
    <button 
      v-if="isVisible"
      @click="scrollToTop"
      class="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[var(--primary)] text-white shadow-lg hover:bg-[var(--primary-hover)] hover:scale-110 transition-all duration-200 flex items-center justify-center"
      :aria-label="t('common.backToTop')"
    >
      <UIcon name="i-heroicons-chevron-up" class="w-6 h-6" />
    </button>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
