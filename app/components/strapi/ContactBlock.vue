<script setup lang="ts">
import type { StrapiContact } from '~/interfaces'
import { resolveLink } from '~/helpers/links'

const props = defineProps<{
  block: StrapiContact
}>()

const { t } = useI18n()
const { localizePath } = useLocaleUtils()

const fediverseLink = computed(() =>
  props.block.fediverseLink ? resolveLink(props.block.fediverseLink.url, localizePath) : null,
)
const extraLink = computed(() =>
  props.block.extraLink ? resolveLink(props.block.extraLink.url, localizePath) : null,
)
</script>

<template>
  <section class="bd-home-section bd-contact-section bd-reveal" :aria-label="block.title || block.eyebrow || undefined">
    <div class="bd-contact-intro">
      <p v-if="block.eyebrow" class="bd-eyebrow bd-home-eyebrow">{{ block.eyebrow }}</p>
      <h2 v-if="block.title" class="bd-contact-title bd-wide">{{ block.title }}</h2>
      <div v-if="block.fediverseHandle" class="bd-contact-fedi">
        <span v-if="block.fediverseLabel" class="bd-eyebrow bd-contact-fedi-label">{{ block.fediverseLabel }}</span>
        <span class="font-mono bd-contact-fedi-handle">{{ block.fediverseHandle }}</span>
        <NuxtLink
          v-if="block.fediverseLink && fediverseLink"
          :to="fediverseLink.href"
          class="bd-author-card-link"
          :target="fediverseLink.external ? '_blank' : undefined"
          :rel="fediverseLink.external ? 'noopener noreferrer' : undefined"
        >
          {{ block.fediverseLink.label }} <span aria-hidden="true">→</span>
        </NuxtLink>
      </div>
      <NuxtLink
        v-if="block.extraLink && extraLink"
        :to="extraLink.href"
        class="bd-share-link"
        :target="extraLink.external ? '_blank' : undefined"
        :rel="extraLink.external ? 'noopener noreferrer' : undefined"
      >
        {{ block.extraLink.label }} <span v-if="extraLink.external" aria-hidden="true">↗</span>
      </NuxtLink>
    </div>
    <nav v-if="block.socials?.length" class="bd-contact-list" :aria-label="t('bd.footer.social')">
      <a
        v-for="social in block.socials"
        :key="social.id"
        :href="social.url"
        class="bd-contact-row"
        target="_blank"
        rel="noopener noreferrer me"
      >
        <span class="bd-eyebrow bd-home-eyebrow">{{ social.network }}</span>
        <span class="bd-contact-handle">{{ social.handle }}</span>
        <span class="bd-contact-arrow" aria-hidden="true">↗</span>
      </a>
    </nav>
  </section>
</template>
