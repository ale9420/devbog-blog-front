<script setup lang="ts">
import type { StrapiRichText, StrapiBlock } from '~/interfaces'

const { t } = useI18n()
const { slugify } = useMarkdownRenderer()

interface Heading {
  id: string
  text: string
  level: number
}

const props = defineProps<{
  blocks: StrapiBlock[]
}>()

const activeId = ref<string>('')

function isRichText(block: StrapiBlock): block is StrapiRichText {
  return block.__component === 'shared.rich-text'
}

const headings = computed<Heading[]>(() => {
  const result: Heading[] = []
  
  props.blocks?.forEach(block => {
    if (isRichText(block) && block.body) {
      const lines = block.body.split('\n')
      lines.forEach(line => {
        const h2Match = line.match(/^## (.+)$/)
        const h3Match = line.match(/^### (.+)$/)
        
        if (h2Match?.[1]) {
          const text = h2Match[1].trim()
          result.push({
            id: slugify(text),
            text,
            level: 2
          })
        } else if (h3Match?.[1]) {
          const text = h3Match[1].trim()
          result.push({
            id: slugify(text),
            text,
            level: 3
          })
        }
      })
    }
  })
  
  return result
})

function scrollToHeading(id: string) {
  const element = document.getElementById(id)
  if (element) {
    const offset = 100
    const elementPosition = element.getBoundingClientRect().top + window.scrollY
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth'
    })
  }
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      })
    },
    { rootMargin: '-100px 0px -80% 0px' }
  )
  
  headings.value.forEach(heading => {
    const element = document.getElementById(heading.id)
    if (element) observer.observe(element)
  })
  
  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <nav v-if="headings.length > 0" class="space-y-1">
    <p class="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
      {{ t('tableOfContents.onThisPage') }}
    </p>
    <a
      v-for="heading in headings"
      :key="heading.id"
      href="#"
      @click.prevent="scrollToHeading(heading.id)"
      class="block text-sm py-1.5 transition-colors"
      :class="[
        heading.level === 3 ? 'pl-4' : '',
        activeId === heading.id
          ? 'text-[var(--primary)] font-medium'
          : 'text-[var(--muted)] hover:text-[var(--foreground)]'
      ]"
    >
      {{ heading.text }}
    </a>
  </nav>
</template>
