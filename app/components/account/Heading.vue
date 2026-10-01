<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
}>()

const titleRef = ref<HTMLElement>()

function focus(): void {
  titleRef.value?.focus()
}

defineExpose({ focus })
</script>

<template>
  <div class="bd-account-heading">
    <p class="bd-eyebrow">{{ eyebrow }}</p>
    <h1 ref="titleRef" class="bd-account-title bd-wide" tabindex="-1">{{ title }}</h1>
    <p v-if="$slots.default" class="bd-account-lead"><slot /></p>
  </div>
</template>
