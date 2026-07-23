<script setup lang="ts">
import { Locale } from "~/interfaces";

const { locale, t } = useI18n();
const { useFetchAbout } = useStrapi();
const { canonicalUrl } = useCanonicalUrl("/about");

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
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
    <div v-if="pending" class="animate-pulse space-y-4">
      <div class="h-32 bg-[var(--surface-elevated)] rounded"></div>
      <div class="h-64 bg-[var(--surface-elevated)] rounded"></div>
    </div>

    <template v-else-if="about">
      <StrapiBlocksRenderer class="prose prose-devbog dark:prose-invert max-w-none" :blocks="about.blocks" />
    </template>

    <div v-else class="text-center text-[var(--muted)]">
      <p>{{ t("about.contentNotAvailable") }}</p>
    </div>
  </div>
</template>
