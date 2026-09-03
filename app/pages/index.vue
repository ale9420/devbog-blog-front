<script setup lang="ts">
import { Locale } from '~/interfaces'

const { locale, t } = useI18n()
const { useFetchPosts } = useStrapi()
const { localizePath } = useLocaleUtils()
const { siteUrl } = useSiteUrl()
const { canonicalUrl } = useCanonicalUrl('/')

const { data: postsResult, pending } = useFetchPosts({ pageSize: 7, locale: locale.value as Locale })

const posts = computed(() => postsResult.value?.data || [])

const featuredPost = computed(() => {
  if (posts.value && posts.value.length > 0) {
    return posts.value[0]
  }
  return null
})

useSeoMeta({
  title: 'BogDev - Personal Blog',
  ogTitle: 'BogDev - Personal Blog',
  description: 'Explore articles on AI, software development, Linux, and modern tech. Join me on my journey through technology.',
  ogDescription: 'Explore articles on AI, software development, Linux, and modern tech. Join me on my journey through technology.',
  ogUrl: () => canonicalUrl.value,
  twitterCard: 'summary_large_image',
  twitterTitle: 'BogDev - Personal Blog',
  twitterDescription: 'Explore articles on AI, software development, Linux, and modern tech.'
})

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl.value}/#website`,
      url: siteUrl.value,
      name: 'BogDev',
      description: 'Personal blog about AI, Software, Linux and more',
      publisher: {
        '@id': `${siteUrl.value}/#organization`
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl.value}/blog?search={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      },
      inLanguage: locale.value === 'es' ? 'es-CO' : 'en-US'
    },
    {
      '@type': 'Organization',
      '@id': `${siteUrl.value}/#organization`,
      name: 'BogDev',
      url: siteUrl.value,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl.value}/bogdev.svg`
      },
      sameAs: [
        'https://github.com/ale9420',
        'https://www.linkedin.com/in/alejandro-ramirez-garcia-046713139',
        'https://codeberg.org/alejo9420',
        'https://mastodon.social/@bogdev'
      ]
    }
  ]
}))

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(structuredData.value)
    }
  ]
})
</script>

<template>
  <div>
    <HomeHero v-if="featuredPost" :post="featuredPost" />
    
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="font-display text-2xl lg:text-3xl font-bold">{{ t('home.latestPosts') }}</h2>
          <p class="text-[var(--muted)] mt-1">{{ t('home.freshArticles') }}</p>
        </div>
        <NuxtLink :to="localizePath('/blog')" class="btn-secondary hidden sm:inline-flex items-center gap-2">
          {{ t('home.viewAll') }}
          <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
        </NuxtLink>
      </div>
      
      <div v-if="pending" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="card overflow-hidden animate-pulse">
          <div class="aspect-[16/10] bg-[var(--surface-elevated)]"></div>
          <div class="p-5 space-y-3">
            <div class="h-4 bg-[var(--surface-elevated)] rounded w-1/4"></div>
            <div class="h-6 bg-[var(--surface-elevated)] rounded w-3/4"></div>
            <div class="h-4 bg-[var(--surface-elevated)] rounded"></div>
            <div class="h-4 bg-[var(--surface-elevated)] rounded w-2/3"></div>
          </div>
        </div>
      </div>
      
      <div v-else-if="posts && posts.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BlogPostCard 
          v-for="(post, index) in posts.slice(0, 6)" 
          :key="post.id" 
          :post="post"
          :index="index"
        />
      </div>
      
      <div v-else class="text-center py-16">
        <div class="w-20 h-20 mx-auto mb-6 rounded-full gradient-bogota-subtle flex items-center justify-center">
          <UIcon name="i-heroicons-document-text" class="w-10 h-10 text-[var(--muted)]" />
        </div>
        <h3 class="text-xl font-semibold mb-2">{{ t('home.noPostsYet') }}</h3>
        <p class="text-[var(--muted)]">{{ t('home.checkBackSoon') }}</p>
      </div>
    </section>
    
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <HomeNewsletter />
    </section>
  </div>
</template>
