<script setup lang="ts">
import type { StrapiRichText } from '~/interfaces'

defineProps<{
  block: StrapiRichText
}>()

const { renderMarkdown } = useMarkdownRenderer()
</script>

<template>
  <div v-html="renderMarkdown(block.body)"/>
</template>
