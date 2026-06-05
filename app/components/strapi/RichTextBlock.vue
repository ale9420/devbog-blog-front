<script setup lang="ts">
import type { StrapiRichText } from '~/interfaces'

const props = defineProps<{
  block: StrapiRichText
}>()

const { renderMarkdown } = useMarkdownRenderer()
</script>

<template>
  <div v-html="renderMarkdown(block.body)"></div>
</template>
