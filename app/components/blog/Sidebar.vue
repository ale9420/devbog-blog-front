<script setup lang="ts">
import { formatDate } from '~/helpers/formatDate'

const { t } = useI18n()
const { getMediaUrl } = useStrapi()
const { localizePath } = useLocaleUtils()

const props = defineProps<{
  categories: any[]
  popularTags: string[]
  recentPosts: any[]
  selectedCategory?: string
  selectedTag?: string
}>()

defineEmits<{
  selectCategory: [category: string]
  selectTag: [tag: string]
}>()
</script>

<template>
  <aside class="space-y-6">
    <div class="card p-6">
      <h3 class="font-display font-semibold text-lg mb-4 flex items-center gap-2">
        <UIcon name="i-heroicons-funnel" class="w-5 h-5 text-[var(--primary)]" />
        {{ t('sidebar.categories') }}
      </h3>
      <div class="space-y-2">
        <button 
          v-for="category in categories" 
          :key="category.id"
          @click="$emit('selectCategory', category.attributes?.name || category.name)"
          class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all"
          :class="selectedCategory === (category.attributes?.name || category.name)
            ? 'bg-[var(--primary)] text-white'
            : 'hover:bg-[var(--surface-elevated)] text-[var(--foreground)]'"
        >
          <span>{{ category.attributes?.name || category.name }}</span>
          <span class="text-xs opacity-60">{{ category.count || 0 }}</span>
        </button>
      </div>
    </div>

    <div class="card p-6">
      <h3 class="font-display font-semibold text-lg mb-4 flex items-center gap-2">
        <UIcon name="i-heroicons-tag" class="w-5 h-5 text-[var(--secondary)]" />
        {{ t('sidebar.popularTags') }}
      </h3>
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="tag in popularTags" 
          :key="tag"
          @click="$emit('selectTag', tag)"
          class="px-3 py-1.5 text-sm rounded-full border transition-all"
          :class="selectedTag === tag
            ? 'bg-[var(--secondary)] text-[var(--foreground)] border-[var(--secondary)]'
            : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]'"
        >
          #{{ tag }}
        </button>
      </div>
    </div>

    <div class="card p-6">
      <h3 class="font-display font-semibold text-lg mb-4 flex items-center gap-2">
        <UIcon name="i-heroicons-clock" class="w-5 h-5 text-[var(--primary)]" />
        {{ t('sidebar.recentPosts') }}
      </h3>
      <div class="space-y-4">
        <NuxtLink 
          v-for="post in recentPosts" 
          :key="post.id"
          :to="`${localizePath('/blog')}/${post.slug}`"
          class="flex gap-3 group"
        >
          <div v-if="post.cover?.url" class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <NuxtImg
              :src="getMediaUrl(post.cover.url)"
              :alt="post.title"
              width="64"
              height="64"
              format="webp"
              loading="lazy"
              class="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <div v-else class="w-16 h-16 rounded-lg gradient-bogota-subtle flex items-center justify-center flex-shrink-0">
            <span class="text-lg font-display font-bold text-[var(--muted)]">{{ post.title?.charAt(0) }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-medium line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
              {{ post.title }}
            </h4>
            <p class="text-xs text-[var(--muted)] mt-1">
              {{ formatDate(post.publishedAt) }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </aside>
</template>
