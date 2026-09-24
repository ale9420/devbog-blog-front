<script setup lang="ts">
import type { StrapiTopic } from '~/interfaces'
import { CATEGORY_INFO } from '~/helpers/categories'

defineProps<{
  topic: StrapiTopic
  label: string
  pillar?: boolean
}>()

const { t } = useI18n()
</script>

<template>
  <article :class="['bd-topic', { 'bd-topic-pillar': pillar }]">
    <div class="bd-topic-head">
      <BdCategoryTag :category="topic.category" />
      <span class="bd-meta bd-topic-label">{{ label }}</span>
    </div>
    <div class="bd-topic-art"><BdBird :category="topic.category" :size="200" /></div>
    <h3 class="bd-topic-title bd-wide">{{ topic.title }}</h3>
    <p v-if="topic.description" class="bd-topic-text">{{ topic.description }}</p>
    <p class="bd-topic-bird">
      {{ t(`home.guide.topics.${topic.category}.bird`) }} · <i>{{ CATEGORY_INFO[topic.category].scientificName }}</i>
    </p>
  </article>
</template>
