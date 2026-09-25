<script setup lang="ts">
import type { Category, FediverseStats, PostListItem, PostMonth } from '~/interfaces'
import { groupPostsByMonth } from '~/helpers/blog'
import { isCategory } from '~/helpers/categories'
import { formatDotDate } from '~/helpers/formatDate'
import { padCount } from '~/helpers/search'

const props = defineProps<{
  posts: PostListItem[]
  federated?: boolean
}>()

const { t, locale } = useI18n()
const { localizePath } = useLocaleUtils()

const documentIds = computed<string>(() =>
  props.posts.map(post => post.documentId).filter(Boolean).join(','),
)
const { data: stats } = useFetch<Record<string, FediverseStats>>('/api/fediverse/stats', {
  query: { documentIds },
  server: false,
  lazy: true,
  immediate: Boolean(props.federated && documentIds.value),
  watch: props.federated ? [documentIds] : false,
})

const months = computed<PostMonth[]>(() => groupPostsByMonth(props.posts, locale.value))

function postStats(post: PostListItem): FediverseStats | undefined {
  if (!props.federated || !post.documentId) return undefined
  return stats.value?.[post.documentId]
}

function countLabel(month: PostMonth): string {
  return t('blog.log.count', { count: padCount(month.posts.length) }, month.posts.length)
}

function postHref(post: PostListItem): string {
  return `${localizePath('/blog')}/${post.slug}`
}

function postCategory(post: PostListItem): Category | undefined {
  const slug = post.category?.slug
  return isCategory(slug) ? slug : undefined
}
</script>

<template>
  <div class="bd-log">
    <section v-for="month in months" :key="month.key" class="bd-log-month" :aria-labelledby="`bd-log-${month.key}`">
      <header class="bd-log-month-head">
        <h2 :id="`bd-log-${month.key}`" class="bd-eyebrow bd-log-month-title">{{ month.label }}</h2>
        <span class="bd-meta bd-log-month-count">{{ countLabel(month) }}</span>
      </header>
      <ul class="bd-log-list">
        <li v-for="post in month.posts" :key="post.id" class="bd-log-row">
          <time class="bd-meta bd-log-date" :datetime="post.publishedAt ?? undefined">{{ formatDotDate(post.publishedAt) }}</time>
          <span class="bd-log-category">
            <BdCategoryTag v-if="postCategory(post)" :category="postCategory(post)!" />
          </span>
          <span class="bd-log-text">
            <NuxtLink :to="postHref(post)" class="bd-log-link">{{ post.title }}</NuxtLink>
            <span v-if="post.description" class="bd-log-excerpt">{{ post.description }}</span>
          </span>
          <span class="bd-meta bd-log-meta">
            <span v-if="postStats(post)" class="bd-log-stats">
              <span aria-hidden="true">◆</span>
              {{ postStats(post)!.likes }} {{ t('post.fediverse.likes', postStats(post)!.likes) }}
              · {{ postStats(post)!.boosts }} {{ t('post.fediverse.boosts', postStats(post)!.boosts) }}
            </span>
          </span>
        </li>
      </ul>
    </section>
  </div>
</template>
