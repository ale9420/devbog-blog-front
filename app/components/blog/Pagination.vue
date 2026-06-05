<script setup lang="ts">
const { t } = useI18n()

const props = defineProps<{
  currentPage: number
  totalPages: number
  totalItems: number
}>()

const emit = defineEmits<{
  pageChange: [page: number]
}>()

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const { currentPage, totalPages } = props
  
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    
    if (currentPage > 3) {
      pages.push('...')
    }
    
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }
    
    if (currentPage < totalPages - 2) {
      pages.push('...')
    }
    
    if (!pages.includes(totalPages)) {
      pages.push(totalPages)
    }
  }
  
  return pages
})

function goToPage(page: number) {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('pageChange', page)
  }
}
</script>

<template>
  <div v-if="totalPages > 1" class="flex items-center justify-center gap-2">
    <button
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="p-2 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      :aria-label="t('common.ariaPrevPage')"
    >
      <UIcon name="i-heroicons-chevron-left" class="w-5 h-5" />
    </button>
    
    <template v-for="(page, index) in visiblePages" :key="index">
      <button
        v-if="page !== '...'"
        @click="goToPage(page as number)"
        class="w-10 h-10 rounded-lg text-sm font-medium transition-colors"
        :class="[
          currentPage === page
            ? 'bg-[var(--primary)] text-white'
            : 'border border-[var(--border)] text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
        ]"
      >
        {{ page }}
      </button>
      <span v-else class="px-2 text-[var(--muted)]">...</span>
    </template>
    
    <button
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="p-2 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      :aria-label="t('common.ariaNextPage')"
    >
      <UIcon name="i-heroicons-chevron-right" class="w-5 h-5" />
    </button>
  </div>
</template>
