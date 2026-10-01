<script setup lang="ts">
import type { DraftViewState } from '~/interfaces'
import { draftStateKey } from '~/helpers/drafts'
import { formatDotDateTime } from '~/helpers/formatDate'

const props = withDefaults(defineProps<{
  state: DraftViewState
  updatedAt?: string | null
  author?: string
  publishedPath?: string | null
}>(), {
  updatedAt: null,
  author: '',
  publishedPath: null,
})

const { t } = useI18n()
const { localizePath } = useLocaleUtils()

const edited = computed<string>(() => {
  const date = formatDotDateTime(props.updatedAt)
  if (!date) return ''
  return [t('drafts.strip.edited', { date }), props.author].filter(Boolean).join(' · ')
})
</script>

<template>
  <div class="bd-draft-strip" role="status">
    <div class="bd-draft-strip-inner">
      <p class="bd-draft-strip-text">
        <span class="bd-badge bd-badge-draft">{{ t('drafts.strip.badge') }}</span>
        <span>{{ t('drafts.strip.editorsOnly') }} {{ t(`drafts.strip.state.${draftStateKey(state)}`) }}</span>
        <span v-if="edited" class="bd-meta bd-draft-strip-edited">
          <time :datetime="updatedAt ?? undefined">{{ edited }}</time>
        </span>
      </p>
      <nav class="bd-draft-strip-links" :aria-label="t('drafts.strip.badge')">
        <NuxtLink v-if="publishedPath" :to="publishedPath" class="bd-meta bd-draft-strip-link">
          {{ t('drafts.strip.published') }} <span aria-hidden="true">↗</span>
        </NuxtLink>
        <NuxtLink :to="localizePath('/drafts')" class="bd-meta bd-draft-strip-link">
          <span aria-hidden="true">←</span> {{ t('drafts.strip.back') }}
        </NuxtLink>
      </nav>
    </div>
  </div>
</template>
