<script setup lang="ts">
import type { StrapiRichText } from '~/interfaces'

const props = defineProps<{
  block: StrapiRichText
}>()

const { renderMarkdown } = useMarkdownRenderer()
const citations = useBlockCitations(() => props.block)

const root = ref<HTMLElement | null>(null)

useCodeBlockCopy(root)
useMermaid(root)
</script>

<template>
  <div ref="root" v-html="renderMarkdown(block.body, citations)"/>
</template>
