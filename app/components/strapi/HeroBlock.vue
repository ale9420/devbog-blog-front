<script setup lang="ts">
import type { StrapiHero } from '~/interfaces'

defineProps<{
  block: StrapiHero
}>()

const { getMediaUrl } = useStrapi()
</script>

<template>
  <div class="text-center mb-12">
    <div
      v-if="block.avatar"
      class="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-lg"
    >
      <NuxtImg
        :src="getMediaUrl(block.avatar.url)"
        :alt="block.avatar.alternativeText || block.title"
        class="w-full h-full object-cover"
      />
    </div>
    <div
      v-else
      class="w-32 h-32 mx-auto mb-6 rounded-full gradient-bogota flex items-center justify-center text-white text-6xl font-display font-bold shadow-lg"
    >
      {{ block.title.charAt(0) }}
    </div>
    <h1 class="font-display text-4xl lg:text-5xl font-bold mb-4">
      {{ block.title }}
    </h1>
    <p v-if="block.subtitle" class="text-xl text-[var(--muted)]">
      {{ block.subtitle }}
    </p>
  </div>
</template>
