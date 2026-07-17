<script setup lang="ts">
import type { PropType } from 'vue'
import { formatDate } from '~/helpers/formatDate'

interface HeroPost {
  id: number
  title: string
  description?: string
  slug: string
  publishedAt?: string
  readTime?: number
  author?: { name?: string; avatar?: { url: string } }
  category?: { name?: string }
  cover?: { url: string }
}

const { t } = useI18n()
const { getMediaUrl } = useStrapi()
const { localizePath } = useLocaleUtils()

const props = defineProps({
  post: Object as PropType<HeroPost | undefined>
})
</script>

<template>
  <section v-if="post" class="relative overflow-hidden">
    <div class="absolute inset-0 gradient-bogota-subtle"></div>
    <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--primary)]/5 to-transparent"></div>
    <div class="absolute -top-24 -right-24 w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-[var(--secondary)]/10 rounded-full blur-3xl"></div>
    
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div class="order-2 lg:order-1">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface)]/80 backdrop-blur-sm mb-6">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span class="text-sm font-medium">{{ t('home.hero.featuredPost') }}</span>
          </div>
          
          <h2 class="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {{ post.title }}
          </h2>
          
          <p class="text-lg text-[var(--muted)] mb-6 line-clamp-3">
            {{ post.description }}
          </p>
          
          <div class="flex flex-wrap items-center gap-4 mb-8">
            <div class="flex items-center gap-2">
              <SharedAuthorAvatar
                :name="post.author?.name"
                :avatar="post.author?.avatar"
              />
              <div>
                <p class="font-medium text-sm">{{ post.author?.name || t('post.anonymous') }}</p>
                <p class="text-xs text-[var(--muted)]">{{ formatDate(post.publishedAt) }}</p>
              </div>
            </div>
            <span class="hidden sm:block text-[var(--border)]">|</span>
            <div v-if="post.readTime" class="flex items-center gap-1 text-sm text-[var(--muted)]">
              <UIcon name="i-heroicons-clock" class="w-4 h-4" />
              {{ t('blog.readTime', { minutes: post.readTime }) }}
            </div>
          </div>
          
          <NuxtLink 
            :to="`${localizePath('/blog')}/${post.slug}`"
            class="btn-primary inline-flex items-center gap-2"
          >
            {{ t('blog.readMore') }}
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>
        
        <div class="order-1 lg:order-2">
          <div class="relative rounded-2xl overflow-hidden shadow-2xl">
            <NuxtImg
              v-if="post.cover?.url"
              :src="getMediaUrl(post.cover.url)"
              :alt="post.title"
              width="800"
              height="600"
              format="webp"
              loading="eager"
              class="w-full aspect-[4/3] object-cover"
            />
            <div v-else class="w-full aspect-[4/3] gradient-bogota flex items-center justify-center">
              <span class="text-8xl font-display font-bold text-white/30">{{ post.title?.charAt(0) }}</span>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-[var(--foreground)]/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
