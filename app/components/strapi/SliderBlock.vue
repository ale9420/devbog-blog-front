<script setup lang="ts">
import type { StrapiSlider } from '~/interfaces'

const props = defineProps<{
  block: StrapiSlider
}>()

const { getMediaUrl } = useStrapi()

const currentIndex = ref(0)

function prev() {
  currentIndex.value = currentIndex.value > 0
    ? currentIndex.value - 1
    : props.block.files.length - 1
}

function next() {
  currentIndex.value = currentIndex.value < props.block.files.length - 1
    ? currentIndex.value + 1
    : 0
}
</script>

<template>
  <figure class="my-8">
    <div class="relative rounded-xl overflow-hidden shadow-lg">
      <NuxtImg
        v-for="(file, index) in block.files"
        :key="index"
        :src="getMediaUrl(file.url)"
        :alt="file.alternativeText || 'Slider image'"
        width="1000"
        format="webp"
        loading="lazy"
        class="w-full transition-opacity duration-300"
        :class="index === currentIndex ? 'block' : 'hidden'"
      />
      <button
        v-if="block.files.length > 1"
        aria-label="Previous slide"
        class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full text-white flex items-center justify-center transition-colors slider-nav"
        @click="prev"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        v-if="block.files.length > 1"
        aria-label="Next slide"
        class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full text-white flex items-center justify-center transition-colors slider-nav"
        @click="next"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div
        v-if="block.files.length > 1"
        class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2"
      >
        <button
          v-for="(_, index) in block.files"
          :key="index"
          :aria-label="`Go to slide ${index + 1}`"
          class="w-2.5 h-2.5 rounded-full transition-colors"
          :class="index === currentIndex ? 'bg-white' : 'bg-white/50'"
          @click="currentIndex = index"
        />
      </div>
    </div>
    <figcaption
      v-if="block.files[currentIndex]?.caption"
      class="text-sm text-[var(--muted)] text-center mt-2"
    >
      {{ block.files[currentIndex]?.caption }}
    </figcaption>
  </figure>
</template>

<style scoped>
.slider-nav {
    background-color: color-mix(in srgb, var(--foreground) 40%, transparent);
}

.slider-nav:hover {
    background-color: color-mix(in srgb, var(--foreground) 60%, transparent);
}
</style>
