<script setup lang="ts">
import type { StrapiMedia } from '~/interfaces'

const props = defineProps<{
  block: StrapiMedia
}>()

const { getMediaUrl } = useStrapi()

const src = computed(() => getMediaUrl(props.block.file.url))
</script>

<template>
  <figure class="my-8">
    <NuxtImg
      :src="src"
      :alt="block.file.alternativeText || 'Media'"
      width="1000"
      format="webp"
      loading="lazy"
      class="rounded-xl shadow-lg w-full"
    />
    <figcaption
      v-if="block.file.caption"
      class="text-sm text-[var(--muted)] text-center mt-2"
    >
      {{ block.file.caption }}
    </figcaption>
  </figure>
</template>
