<script setup lang="ts">
import type { StrapiBlock, StrapiTopicCard } from '~/interfaces'
import type { Component } from 'vue'
import StrapiRichTextBlock from '~/components/strapi/RichTextBlock.vue'
import StrapiQuoteBlock from '~/components/strapi/QuoteBlock.vue'
import StrapiMediaBlock from '~/components/strapi/MediaBlock.vue'
import StrapiSliderBlock from '~/components/strapi/SliderBlock.vue'
import StrapiHeroBlock from '~/components/strapi/HeroBlock.vue'
import StrapiTopicCardBlock from '~/components/strapi/TopicCardBlock.vue'
import StrapiSocialLinksBlock from '~/components/strapi/SocialLinksBlock.vue'
import StrapiTechStackBlock from '~/components/strapi/TechStackBlock.vue'

const props = defineProps<{
  blocks: StrapiBlock[]
}>()

const componentMap: Record<string, Component> = {
  'shared.rich-text': StrapiRichTextBlock,
  'shared.quote': StrapiQuoteBlock,
  'shared.media': StrapiMediaBlock,
  'shared.slider': StrapiSliderBlock,
  'shared.hero': StrapiHeroBlock,
  'shared.topic-card': StrapiTopicCardBlock,
  'shared.social-links': StrapiSocialLinksBlock,
  'shared.tech-stack': StrapiTechStackBlock,
}

type BlockGroup =
  | { type: 'topic-grid'; blocks: StrapiTopicCard[] }
  | { type: 'single'; block: StrapiBlock }

const groupedBlocks = computed<BlockGroup[]>(() => {
  const groups: BlockGroup[] = []
  let currentTopicCards: StrapiTopicCard[] = []

  for (const block of props.blocks) {
    if (block.__component === 'shared.topic-card') {
      currentTopicCards.push(block)
    } else {
      if (currentTopicCards.length > 0) {
        groups.push({ type: 'topic-grid', blocks: currentTopicCards })
        currentTopicCards = []
      }
      groups.push({ type: 'single', block })
    }
  }

  if (currentTopicCards.length > 0) {
    groups.push({ type: 'topic-grid', blocks: currentTopicCards })
  }

  return groups
})
</script>

<template>
  <template v-for="(group, index) in groupedBlocks" :key="index">
    <div
      v-if="group.type === 'topic-grid'"
      class="grid sm:grid-cols-2 gap-4 not-prose my-6"
    >
      <StrapiTopicCardBlock
        v-for="block in group.blocks"
        :key="block.id"
        :block="block"
      />
    </div>
    <template v-else>
      <component
        :is="componentMap[group.block.__component]"
        v-if="componentMap[group.block.__component]"
        :block="group.block"
      />
      <div
        v-else
        class="text-[var(--muted)] text-sm italic my-4 p-4 border border-[var(--border)] rounded"
      >
        Unknown block type: {{ group.block.__component }}
      </div>
    </template>
  </template>
</template>
