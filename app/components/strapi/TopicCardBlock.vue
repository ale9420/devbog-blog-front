<script setup lang="ts">
import type { StrapiTopicCard } from '~/interfaces'

const props = defineProps<{
  block: StrapiTopicCard
}>()

const iconMap: Record<string, string> = {
  'cpu-chip': 'i-heroicons-cpu-chip',
  'code-bracket': 'i-heroicons-code-bracket',
  'command-line': 'i-heroicons-command-line',
  'cloud': 'i-heroicons-cloud',
  'book-open': 'i-heroicons-book-open',
  'globe': 'i-heroicons-globe-alt',
  'shield-check': 'i-heroicons-shield-check',
  'rocket': 'i-heroicons-rocket-launch',
}

const colorMap: Record<string, string> = {
  'cpu-chip': 'var(--primary)',
  'code-bracket': 'var(--secondary)',
  'command-line': '#22c55e',
  'cloud': '#3b82f6',
}

const iconColor = computed(() => colorMap[props.block.icon] || 'var(--primary)')
</script>

<template>
  <div class="p-4 rounded-lg bg-[var(--surface-elevated)]">
    <div
      class="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
      :style="{ backgroundColor: `color-mix(in srgb, ${iconColor} 10%, transparent)` }"
    >
      <UIcon
        :name="iconMap[block.icon] || 'i-heroicons-question-mark-circle'"
        class="w-5 h-5"
        :style="{ color: iconColor }"
      />
    </div>
    <h3 class="font-semibold mb-1">{{ block.title }}</h3>
    <p v-if="block.description" class="text-sm text-[var(--muted)]">
      {{ block.description }}
    </p>
  </div>
</template>
