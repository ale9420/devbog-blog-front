<script setup lang="ts">
import type { StrapiBlock } from '~/interfaces'
import type { Component } from 'vue'
import StrapiRichTextBlock from '~/components/strapi/RichTextBlock.vue'
import StrapiQuoteBlock from '~/components/strapi/QuoteBlock.vue'
import StrapiMediaBlock from '~/components/strapi/MediaBlock.vue'
import StrapiSliderBlock from '~/components/strapi/SliderBlock.vue'

defineProps<{
  blocks: StrapiBlock[]
}>()

const componentMap: Record<string, Component> = {
  'shared.rich-text': StrapiRichTextBlock,
  'shared.quote': StrapiQuoteBlock,
  'shared.media': StrapiMediaBlock,
  'shared.slider': StrapiSliderBlock,
}
</script>

<template>
  <template v-for="block in blocks" :key="block.id">
    <component
      :is="componentMap[block.__component]"
      v-if="componentMap[block.__component]"
      :block="block"
    />
    <div
      v-else
      class="text-[var(--muted)] text-sm italic my-4 p-4 border border-[var(--border)] rounded"
    >
      Unknown block type: {{ block.__component }}
    </div>
  </template>
</template>
