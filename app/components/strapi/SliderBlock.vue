<script setup lang="ts">
import type { StrapiSlider } from '~/interfaces'

const props = defineProps<{
  block: StrapiSlider
}>()

const { getMediaUrl } = useStrapi()
const { t } = useI18n()

const files = computed(() => props.block.files)
const totalSlides = computed(() => files.value.length)
const hasMultiple = computed(() => totalSlides.value > 1)

const currentIndex = ref(0)
const isPaused = ref(false)
const progress = ref(0)
const isTransitioning = ref(false)

const prefersReducedMotion = ref(false)

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

function goTo(index: number) {
  if (isTransitioning.value || index === currentIndex.value) return
  isTransitioning.value = true
  currentIndex.value = index
  progress.value = 0
  setTimeout(() => { isTransitioning.value = false }, 600)
}

function prev() {
  goTo(currentIndex.value > 0 ? currentIndex.value - 1 : totalSlides.value - 1)
}

function next() {
  goTo(currentIndex.value < totalSlides.value - 1 ? currentIndex.value + 1 : 0)
}

const touchStartX = ref(0)
const touchDeltaX = ref(0)
const isDragging = ref(false)

function onTouchStart(event: TouchEvent) {
  touchStartX.value = event.changedTouches[0]!.screenX
  isDragging.value = true
  touchDeltaX.value = 0
}

function onTouchMove(event: TouchEvent) {
  if (!isDragging.value) return
  touchDeltaX.value = event.changedTouches[0]!.screenX - touchStartX.value
}

function onTouchEnd() {
  isDragging.value = false
  const threshold = 50
  if (Math.abs(touchDeltaX.value) > threshold) {
    touchDeltaX.value < 0 ? next() : prev()
  }
  touchDeltaX.value = 0
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    prev()
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    next()
  }
}

const AUTOPLAY_DURATION = 6000
let animationFrameId: number | null = null
let lastTimestamp: number | null = null

function startAutoplay() {
  if (!hasMultiple.value || prefersReducedMotion.value) return

  const animate = (timestamp: number) => {
    if (lastTimestamp === null) lastTimestamp = timestamp
    const elapsed = timestamp - lastTimestamp

    if (!isPaused.value) {
      progress.value += (elapsed / AUTOPLAY_DURATION) * 100
      if (progress.value >= 100) {
        progress.value = 0
        next()
      }
    }

    lastTimestamp = timestamp
    animationFrameId = requestAnimationFrame(animate)
  }

  animationFrameId = requestAnimationFrame(animate)
}

function stopAutoplay() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
    lastTimestamp = null
  }
}

watch(hasMultiple, (value) => {
  if (value) {
    startAutoplay()
  } else {
    stopAutoplay()
  }
})

onMounted(() => {
  if (hasMultiple.value) startAutoplay()
})

onUnmounted(stopAutoplay)
</script>

<template>
  <figure
    class="my-8 select-none"
    tabindex="0"
    role="region"
    aria-roledescription="carousel"
    :aria-label="t('common.ariaGallery', 'Image gallery')"
    @keydown="onKeydown"
  >
    <div
      class="relative overflow-hidden rounded-2xl bg-[var(--surface)] shadow-2xl group"
      @mouseenter="isPaused = true"
      @mouseleave="isPaused = false"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend.passive="onTouchEnd"
    >
      <div class="relative aspect-[16/10]">
        <div
          v-for="(file, index) in files"
          :key="index"
          class="absolute inset-0 transition-opacity duration-700 ease-in-out"
          :class="index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'"
          role="group"
          :aria-roledescription="hasMultiple ? 'slide' : undefined"
          :aria-label="`${index + 1} ${t('common.of', 'of')} ${totalSlides}`"
          :aria-hidden="index !== currentIndex"
        >
          <NuxtImg
            :src="getMediaUrl(file.url)"
            :alt="file.alternativeText || t('common.ariaGalleryImage', 'Gallery image')"
            width="1200"
            format="webp"
            loading="lazy"
            draggable="false"
            class="w-full h-full object-cover"
            :class="{
              'scale-105 animate-[kenburns_8s_ease-out_forwards]': index === currentIndex && !prefersReducedMotion
            }"
          />
        </div>
      </div>

      <div
        v-if="hasMultiple"
        class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none z-20"
      />

      <template v-if="hasMultiple">
        <button
          :aria-label="t('common.ariaPrevSlide', 'Previous slide')"
          class="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md shadow-xl hover:bg-white hover:scale-110 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 text-neutral-900 dark:text-white"
          @click="prev"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          :aria-label="t('common.ariaNextSlide', 'Next slide')"
          class="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md shadow-xl hover:bg-white hover:scale-110 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 text-neutral-900 dark:text-white"
          @click="next"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </template>

      <div
        v-if="hasMultiple"
        class="absolute bottom-0 inset-x-0 p-5 flex items-center justify-center gap-3 z-30"
      >
        <div class="flex items-center gap-2">
          <button
            v-for="(_, index) in files"
            :key="index"
            :aria-label="`${t('common.goToSlide', 'Go to slide')} ${index + 1}`"
            class="relative h-1 rounded-full overflow-hidden transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            :class="index === currentIndex ? 'w-10' : 'w-6 hover:w-8'"
            @click="goTo(index)"
          >
            <span class="absolute inset-0 bg-white/30 rounded-full" />
            <span
              v-if="index === currentIndex"
              class="absolute inset-y-0 left-0 bg-white rounded-full transition-all duration-100 ease-linear"
              :style="{ width: `${progress}%` }"
            />
            <span
              v-else
              class="absolute inset-0 bg-white/60 rounded-full opacity-0 hover:opacity-100 transition-opacity"
            />
          </button>
        </div>
      </div>

      <div
        v-if="hasMultiple"
        class="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <span class="text-xs text-white/90 font-mono tabular-nums tracking-wider bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
          {{ String(currentIndex + 1).padStart(2, '0') }} / {{ String(totalSlides).padStart(2, '0') }}
        </span>
      </div>
    </div>

    <figcaption
      v-if="files[currentIndex]?.caption"
      class="text-sm text-[var(--muted)] text-center mt-4 leading-relaxed max-w-2xl mx-auto"
    >
      {{ files[currentIndex]?.caption }}
    </figcaption>
  </figure>
</template>

<style scoped>
@keyframes kenburns {
  0% {
    transform: scale(1) translate(0, 0);
  }
  100% {
    transform: scale(1.08) translate(-1%, -1%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .animate-\[kenburns_8s_ease-out_forwards\] {
    animation: none !important;
    transform: scale(1) !important;
  }
}
</style>
