<script setup lang="ts">
import type { Locale } from "~/interfaces";

const { locale, t } = useI18n();
const { fetchAbout, getMediaUrl } = useStrapi();
const { canonicalUrl } = useCanonicalUrl("/about");
const { siteUrl } = useSiteUrl();

const { data: about } = await fetchAbout(locale.value as Locale);

const shareImageUrl = computed(() => {
  const metaImage = about.value?.seo?.metaImage;
  return getMediaUrl(metaImage?.url || metaImage?.data?.attributes?.url) || `${siteUrl.value}/og-image.png`;
});

useSeoMeta({
  title: () => about.value?.seo?.metaTitle || "About - BogDev",
  ogTitle: () => about.value?.seo?.metaTitle || "About - BogDev",
  description: () => about.value?.seo?.metaDescription || "",
  ogDescription: () => about.value?.seo?.metaDescription || "",
  ogImage: () => shareImageUrl.value,
  ogImageAlt: 'BogDev — About',
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
  <div class="bd-about">
    <StrapiBlocksRenderer v-if="about?.blocks?.length" :blocks="about.blocks" />
    <p v-else class="bd-meta bd-home-eyebrow bd-about-empty">{{ t("about.contentNotAvailable") }}</p>
  </div>
</template>
