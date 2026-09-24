<script setup lang="ts">
const { t } = useI18n()
const { siteUrl } = useSiteUrl()

const feedCommand = computed<string>(() => `$ curl -s ${siteUrl.value}/feed.xml`)
</script>

<template>
  <section id="newsletter" class="bd-home-section bd-subscribe bd-reveal">
    <BdNewsletterForm id="nl-home" class="bd-subscribe-form" />
    <div class="bd-subscribe-rss">
      <p class="bd-eyebrow bd-home-eyebrow">{{ t('home.rss.title') }}</p>
      <p class="bd-home-intro">{{ t('home.rss.description') }}</p>
      <BdCodeBlock lang="shell" :code="feedCommand" />
    </div>
  </section>
</template>
