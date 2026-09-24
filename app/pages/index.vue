<script setup lang="ts">
import type { Category, FieldGuideTopic, Locale, PostListItem } from '~/interfaces'
import { CATEGORIES, isCategory } from '~/helpers/categories'

const { locale, t } = useI18n()
const { fetchPosts, fetchCategories } = useStrapi()
const { siteUrl } = useSiteUrl()
const { canonicalUrl } = useCanonicalUrl('/')
const toPostCard = usePostCard()

const { data: postsResult } = fetchPosts({ pageSize: 1, locale: locale.value as Locale })
const { data: categories } = fetchCategories(locale.value as Locale)

const featuredPost = computed<PostListItem | undefined>(() => postsResult.value?.data[0])
const total = computed<number>(() => postsResult.value?.pagination.total ?? 0)
const counts = computed<Partial<Record<Category, number>>>(() =>
  Object.fromEntries(
    (categories.value ?? [])
      .filter(category => isCategory(category.slug))
      .map(category => [category.slug, category.count]),
  ),
)
const topics = computed<FieldGuideTopic[]>(() =>
  CATEGORIES.map(category => ({ category, count: counts.value[category] ?? 0 })),
)

useSeoMeta({
  title: 'BogDev - Personal Blog',
  ogTitle: 'BogDev - Personal Blog',
  description: 'Explore articles on AI, software development, Linux, and modern tech. Join me on my journey through technology.',
  ogDescription: 'Explore articles on AI, software development, Linux, and modern tech. Join me on my journey through technology.',
  ogImage: () => `${siteUrl.value}/og-image.png`,
  ogImageAlt: 'BogDev — Exploring AI, Software and Linux',
  ogUrl: () => canonicalUrl.value,
  twitterCard: 'summary_large_image',
  twitterImage: () => `${siteUrl.value}/og-image.png`,
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
  <div class="bd-home">
    <HomeHero :total="total" />

    <section v-if="featuredPost" class="bd-home-featured bd-reveal" :aria-label="t('bd.card.featured')">
      <BdPostCard v-bind="toPostCard(featuredPost)" featured priority />
    </section>

    <HomeLatest :total="total" :counts="counts" />

    <HomeFieldGuide :topics="topics" />

    <div id="fediverso" />

    <HomeSubscribe />
  </div>
</template>
