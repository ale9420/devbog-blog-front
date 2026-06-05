<script setup lang="ts">
const { t } = useI18n()
const isVisible = ref(false)

function skipToContent() {
  const main = document.querySelector('main')
  if (main) {
    main.tabIndex = -1
    main.focus()
  }
}

function skipToSearch() {
  const searchInput = document.querySelector('input[type="search"], input[placeholder*="Search"]')
  if (searchInput instanceof HTMLElement) {
    searchInput.focus()
  }
}

onMounted(() => {
  isVisible.value = true
  setTimeout(() => {
    isVisible.value = false
  }, 5000)
})
</script>

<template>
  <div 
    class="fixed top-0 left-0 right-0 z-[9999]"
    role="navigation"
    :aria-label="t('common.ariaSkipLinks')"
  >
    <div 
      class="bg-[var(--primary)] text-white px-4 py-2 flex flex-wrap gap-4"
      :class="{ 'sr-only': !isVisible }"
    >
      <a 
        href="#main-content"
        @click.prevent="skipToContent"
        class="text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded px-2 py-1"
      >
        {{ t('common.skipToMain') }}
      </a>
      <a 
        href="#search"
        @click.prevent="skipToSearch"
        class="text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded px-2 py-1"
      >
        {{ t('common.skipToSearch') }}
      </a>
    </div>
  </div>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
