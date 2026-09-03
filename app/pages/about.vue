<script setup lang="ts">
import { Locale } from "~/interfaces";

const { locale, t } = useI18n();
const { useFetchAbout } = useStrapi();
const { canonicalUrl } = useCanonicalUrl("/about");
const { siteUrl } = useSiteUrl();

const { data: about, pending } = useFetchAbout(locale.value as Locale);

useSeoMeta({
  title: () => about.value?.seo?.metaTitle || "About - BogDev",
  ogTitle: () => about.value?.seo?.metaTitle || "About - BogDev",
  description: () => about.value?.seo?.metaDescription || "",
  ogDescription: () => about.value?.seo?.metaDescription || "",
  ogImage: "/og-image.png",
  ogUrl: () => canonicalUrl.value,
  ogType: "profile",
  twitterCard: "summary",
  twitterTitle: () => about.value?.seo?.metaTitle || "About - BogDev",
  twitterDescription: () => about.value?.seo?.metaDescription || "",
});

useHead({
  link: [
    {
      rel: "canonical",
      href: () => about.value?.seo?.canonicalURL || canonicalUrl.value,
    },
  ],
});

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Alejandro Ramirez',
  url: `${siteUrl.value}/about`,
  jobTitle: 'Software Developer',
  description: 'Colombian software developer passionate about AI, Linux, and open source',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bogotá',
    addressCountry: 'CO'
  },
  sameAs: [
    'https://github.com/ale9420',
    'https://www.linkedin.com/in/alejandro-ramirez-garcia-046713139',
    'https://codeberg.org/alejo9420',
    'https://mastodon.social/@bogdev'
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'BogDev'
  }
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
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
    <div v-if="pending" class="animate-pulse space-y-4">
      <div class="h-32 bg-[var(--surface-elevated)] rounded"></div>
      <div class="h-64 bg-[var(--surface-elevated)] rounded"></div>
    </div>

    <template v-else-if="about">
      <div class="prose prose-devbog dark:prose-invert max-w-none">
        <StrapiBlocksRenderer :blocks="about.blocks" />
      </div>
    </template>

    <div v-else class="text-center text-[var(--muted)]">
      <p>{{ t("about.contentNotAvailable") }}</p>
    </div>
  </div>
</template>
