<script setup lang="ts">
import type { ButtonSize, ButtonVariant } from '~/interfaces'

const props = withDefaults(defineProps<{
  variant?: ButtonVariant
  size?: ButtonSize
  arrow?: boolean
  href?: string
  type?: 'button' | 'submit' | 'reset'
}>(), {
  variant: 'primary',
  size: 'md',
  arrow: false,
  href: undefined,
  type: 'button',
})

const classes = computed<(string | Record<string, boolean>)[]>(() => [
  'bd-btn',
  `bd-btn-${props.variant}`,
  { 'bd-btn-sm': props.size === 'sm' },
])
</script>

<template>
  <NuxtLink v-if="href" :to="href" :class="classes">
    <slot />
    <span v-if="arrow" class="bd-btn-arrow" aria-hidden="true">→</span>
  </NuxtLink>
  <button v-else :type="type" :class="classes">
    <slot />
    <span v-if="arrow" class="bd-btn-arrow" aria-hidden="true">→</span>
  </button>
</template>
