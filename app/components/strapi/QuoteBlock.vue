<script setup lang="ts">
import type { StrapiQuote } from '~/interfaces'

const props = defineProps<{
  block: StrapiQuote
}>()

const { renderInlineMarkdown } = useMarkdownRenderer()
const citations = useBlockCitations(() => props.block)
</script>

<template>
  <blockquote class="border-l-4 border-[var(--primary)] pl-6 my-8 italic">
    <p class="text-xl text-[var(--foreground)] mb-2" v-html="renderInlineMarkdown(block.body, citations)"/>
    <cite v-if="block.title" class="text-sm text-[var(--muted)] not-italic">
      — {{ block.title }}
    </cite>
  </blockquote>
</template>
