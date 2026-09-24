<script setup lang="ts">
import type { StrapiProject, StrapiProjects } from '~/interfaces'

const props = defineProps<{
  block: StrapiProjects
}>()

const featured = computed<StrapiProject[]>(() => (props.block.projects ?? []).filter(project => project.featured))
const others = computed<StrapiProject[]>(() => (props.block.projects ?? []).filter(project => !project.featured))
</script>

<template>
  <section :id="block.anchor || undefined" class="bd-home-section bd-projects bd-reveal" :aria-label="block.title || block.eyebrow || undefined">
    <div v-if="block.eyebrow || block.title || block.intro" class="bd-home-head">
      <div class="bd-home-heading">
        <p v-if="block.eyebrow" class="bd-eyebrow bd-home-eyebrow">{{ block.eyebrow }}</p>
        <h2 v-if="block.title" class="bd-home-title bd-stretch">{{ block.title }}</h2>
      </div>
      <p v-if="block.intro" class="bd-home-intro">{{ block.intro }}</p>
    </div>
    <StrapiProjectCard v-for="project in featured" :key="project.id" :project="project" />
    <div v-if="others.length" class="bd-project-grid">
      <StrapiProjectCard v-for="project in others" :key="project.id" :project="project" />
    </div>
  </section>
</template>
