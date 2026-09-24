<script setup lang="ts">
import type { StrapiStatement } from '~/interfaces'

defineProps<{
  block: StrapiStatement
}>()
</script>

<template>
  <section class="bd-home-section bd-about-split bd-reveal">
    <p v-if="block.eyebrow" class="bd-eyebrow bd-home-eyebrow bd-about-split-label">{{ block.eyebrow }}</p>
    <div class="bd-about-split-body">
      <p class="bd-statement bd-wide">{{ block.statement }}</p>
      <p v-if="block.body" class="bd-statement-body">{{ block.body }}</p>
    </div>
  </section>
</template>
