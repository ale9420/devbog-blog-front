<script setup lang="ts">
import { formatDate } from '~/helpers/formatDate'

const { t } = useI18n()
const { getMediaUrl } = useStrapi()
const { localizePath } = useLocaleUtils()

const props = defineProps<{
  currentPostId?: number
  categoryId?: number
}>()

const { data: relatedPosts, pending } = await useAsyncData(
  `related-posts-${props.currentPostId}`,
  async () => {
    if (!props.categoryId) return []
    
    const response = await $fetch<{ data: any[] }>(
      `${useRuntimeConfig().public.strapiUrl}/api/articles?filters[category][id][$eq]=${props.categoryId}&filters[id][$ne]=${props.currentPostId}&pagination[pageSize]=3&populate[cover]=*&populate[category]=*&sort=publishedAt:desc`
    )
    return response.data || []
  }
)
</script>

<template>
  <section v-if="relatedPosts?.length" class="mt-12 pt-8 border-t border-[var(--border)]">
    <h3 class="font-display text-xl font-semibold mb-6">{{ t('blog.related') }}</h3>
    <div class="grid md:grid-cols-3 gap-6">
      <NuxtLink
        v-for="post in relatedPosts"
        :key="post.id"
        :to="`${localizePath('/blog')}/${post.slug}`"
        class="card group overflow-hidden flex flex-col"
      >
        <div class="aspect-[16/10] overflow-hidden">
          <NuxtImg
            v-if="post.cover?.url"
            :src="getMediaUrl(post.cover.url)"
            :alt="post.title"
            width="400"
            height="250"
            format="webp"
            loading="lazy"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div v-else class="w-full h-full gradient-bogota-subtle flex items-center justify-center">
            <span class="text-4xl font-display font-bold text-[var(--border)]">
              {{ post.title?.charAt(0) }}
            </span>
          </div>
        </div>
        <div class="p-4 flex-1 flex flex-col">
          <h4 class="font-medium text-sm line-clamp-2 group-hover:text-[var(--primary)] transition-colors mb-2">
            {{ post.title }}
          </h4>
          <p class="text-xs text-[var(--muted)] mt-auto">
            {{ formatDate(post.publishedAt) }}
          </p>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
