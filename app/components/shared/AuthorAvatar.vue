<script setup lang="ts">
import { getInitial } from '~/helpers/string'

const props = withDefaults(defineProps<{
  name?: string
  avatar?: { url: string } | string | null
  size?: 'sm' | 'md' | 'lg'
}>(), {
  size: 'md'
})

const { getMediaUrl } = useStrapi()

const resolvedUrl = computed(() => {
  if (!props.avatar) return ''
  if (typeof props.avatar === 'string') return props.avatar
  return getMediaUrl(props.avatar.url)
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'w-8 h-8 text-sm'
    case 'lg': return 'w-12 h-12 text-lg'
    default: return 'w-10 h-10 text-base'
  }
})
</script>

<template>
  <div
    class="rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center"
    :class="sizeClasses"
  >
    <NuxtImg
      v-if="resolvedUrl"
      :src="resolvedUrl"
      :alt="name || 'Avatar'"
      width="96"
      height="96"
      format="webp"
      loading="lazy"
      class="w-full h-full object-cover"
    />
    <span
      v-else
      class="w-full h-full gradient-bogota flex items-center justify-center text-white font-semibold"
    >
      {{ getInitial(name, 'A') }}
    </span>
  </div>
</template>
