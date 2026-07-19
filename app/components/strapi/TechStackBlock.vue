<script setup lang="ts">
import type { StrapiTechStack } from '~/interfaces'

defineProps<{
  block: StrapiTechStack
}>()
</script>

<template>
  <div class="card p-8 gradient-bogota-subtle">
    <h3 v-if="block.title" class="font-display text-xl font-semibold mb-4">
      {{ block.title }}
    </h3>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="tech in block.technologies"
        :key="tech.id"
        class="px-3 py-1.5 rounded-full text-sm bg-[var(--surface)] border border-[var(--border)]"
      >
        {{ tech.name }}
      </span>
    </div>
  </div>
</template>
