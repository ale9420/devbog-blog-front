<script setup lang="ts">
import type { StrapiPrinciples } from '~/interfaces'
import { padCount } from '~/helpers/search'

defineProps<{
  block: StrapiPrinciples
}>()
</script>

<template>
  <section class="bd-home-section bd-reveal" :aria-label="block.title || block.eyebrow || undefined">
    <div v-if="block.eyebrow || block.title" class="bd-home-heading">
      <p v-if="block.eyebrow" class="bd-eyebrow bd-home-eyebrow">{{ block.eyebrow }}</p>
      <h2 v-if="block.title" class="bd-home-title bd-stretch">{{ block.title }}</h2>
    </div>
    <ol v-if="block.principles?.length" class="bd-principles">
      <li v-for="(principle, index) in block.principles" :key="principle.id" class="bd-principle">
        <span class="bd-principle-number" aria-hidden="true">{{ padCount(index + 1) }}</span>
        <h3 v-if="principle.title" class="bd-principle-title bd-wide">{{ principle.title }}</h3>
        <p class="bd-principle-text">{{ principle.text }}</p>
      </li>
    </ol>
  </section>
</template>
