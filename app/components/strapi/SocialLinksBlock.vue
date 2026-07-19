<script setup lang="ts">
import type { StrapiSocialLinks } from '~/interfaces'

defineProps<{
  block: StrapiSocialLinks
}>()
</script>

<template>
  <div class="mt-6">
    <h2 v-if="block.title" class="mt-6">{{ block.title }}</h2>
    <p v-if="block.description">{{ block.description }}</p>
    <div class="flex flex-wrap gap-4 not-prose mt-2">
      <a
        v-if="block.linkedin"
        :href="block.linkedin"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--brand-linkedin)] hover:text-white transition-colors"
      >
        <IconsLinkedInIcon />
        LinkedIn
      </a>
      <a
        v-if="block.github"
        :href="block.github"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--brand-github)] hover:text-white transition-colors"
      >
        <IconsGitHubIcon class="w-5 h-5" />
        GitHub
      </a>
      <a
        v-if="block.codeberg"
        :href="block.codeberg"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--brand-codeberg)] hover:text-white transition-all"
      >
        <IconsCodebergIcon />
        Codeberg
      </a>
      <a
        v-if="block.mastodon"
        :href="block.mastodon"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--brand-mastodon)] hover:text-white transition-colors"
      >
        <IconsMastodonIcon />
        Mastodon
      </a>
      <a
        v-if="block.twitter"
        :href="block.twitter"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--brand-twitter)] hover:text-white transition-colors"
      >
        <UIcon name="i-simple-icons-x" class="w-5 h-5" />
        Twitter
      </a>
    </div>
  </div>
</template>
