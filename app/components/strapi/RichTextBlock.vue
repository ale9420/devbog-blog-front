<script setup lang="ts">
import type { StrapiRichText } from '~/interfaces'

defineProps<{
  block: StrapiRichText
}>()

const { renderMarkdown } = useMarkdownRenderer()

const root = ref<HTMLElement | null>(null)

useCodeBlockCopy(root)
</script>

<template>
  <div ref="root" v-html="renderMarkdown(block.body)"/>
</template>
