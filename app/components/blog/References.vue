<script setup lang="ts">
import type { NumberedReference } from '~/interfaces'
import { formatAccessDate, formatApa, latestAccessedAt, referenceIdentifier, referenceVenue } from '~/helpers/citations'

const props = defineProps<{
  entries: NumberedReference[]
}>()

const { t } = useI18n()

const items = computed(() => props.entries.map(entry => ({
  ...entry,
  venue: referenceVenue(entry.reference),
  segments: formatApa(entry.reference),
  identifier: referenceIdentifier(entry.reference),
})))

const note = computed<string>(() => {
  const date = latestAccessedAt(props.entries.map(entry => entry.reference))
  const accessed = date ? t('post.references.accessed', { date: formatAccessDate(date) }) : ''
  return [t('post.references.note'), accessed].filter(Boolean).join(' ')
})
</script>

<template>
  <section v-if="entries.length" id="references" class="bd-refs" aria-labelledby="references-title">
    <div class="bd-refs-head">
      <h2 id="references-title" class="bd-refs-title">{{ t('post.references.title') }}</h2>
      <span class="bd-meta bd-refs-count">{{ t('post.references.count', { n: entries.length }, entries.length) }}</span>
    </div>
    <ol class="bd-refs-list">
      <li v-for="item in items" :id="`ref-${item.number}`" :key="item.reference.key" class="bd-ref">
        <span class="bd-ref-n" aria-hidden="true">[{{ item.number }}]</span>
        <div class="bd-ref-body">
          <span v-if="item.venue" class="bd-eyebrow bd-ref-venue">{{ item.venue }}</span>
          <p class="bd-ref-text">
            <template v-for="(segment, index) in item.segments" :key="index">
              <a v-if="segment.kind === 'title' && segment.href" :href="segment.href" target="_blank" rel="noopener noreferrer">{{ segment.text }}</a>
              <em v-else-if="segment.kind === 'container'">{{ segment.text }}</em>
              <template v-else>{{ segment.text }}</template>
            </template>
          </p>
          <div class="bd-ref-meta">
            <span v-if="item.identifier" class="bd-ref-id">{{ item.identifier.text }}</span>
            <a
              v-if="item.cited"
              class="bd-ref-back"
              :href="`#cite-${item.number}`"
              :aria-label="t('post.references.backLabel', { n: item.number })"
            >↩ {{ t('post.references.back') }}</a>
          </div>
        </div>
      </li>
    </ol>
    <p class="bd-meta bd-refs-note">{{ note }}</p>
  </section>
</template>
