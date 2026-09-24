<script setup lang="ts">
import type { TocHeading } from '~/interfaces'

const SCROLL_OFFSET = 160
const SCROLL_THROTTLE_MS = 100

const props = defineProps<{
  headings: TocHeading[]
}>()

const { t } = useI18n()

const activeId = ref<string>(props.headings[0]?.id ?? '')

const { y } = useWindowScroll()

const updateActive = useThrottleFn(() => {
  let current = props.headings[0]?.id ?? ''
  for (const heading of props.headings) {
    const element = document.getElementById(heading.id)
    if (element && element.getBoundingClientRect().top <= SCROLL_OFFSET) current = heading.id
  }
  activeId.value = current
}, SCROLL_THROTTLE_MS, true)

watch(y, () => updateActive())

onMounted(() => {
  updateActive()
})
</script>

<template>
  <nav v-if="headings.length" class="bd-toc" :aria-label="t('post.toc')">
    <p class="bd-eyebrow bd-toc-title">{{ t('post.toc') }}</p>
    <a
      v-for="heading in headings"
      :key="heading.id"
      :href="`#${heading.id}`"
      :class="['bd-toc-link', { 'bd-toc-sub': heading.level === 3 }]"
      :aria-current="activeId === heading.id ? 'true' : undefined"
      @click="activeId = heading.id"
    >
      {{ heading.text }}
    </a>
  </nav>
</template>
