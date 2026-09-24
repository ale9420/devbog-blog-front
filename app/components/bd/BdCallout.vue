<script setup lang="ts">
import type { CalloutTone } from '~/interfaces'

const props = withDefaults(defineProps<{
  tone?: CalloutTone
  title?: string
}>(), {
  tone: 'nota',
  title: undefined,
})

const GLYPHS: Record<CalloutTone, string> = { nota: '◆', aviso: '▲', peligro: '✕' }

const { t } = useI18n()

const heading = computed<string>(() => props.title ?? t(`bd.callout.${props.tone}`))
</script>

<template>
  <aside
    :class="['bd-callout', `bd-callout-${tone}`]"
    :role="tone === 'peligro' ? 'alert' : 'note'"
  >
    <span class="bd-callout-label"><span aria-hidden="true">{{ `${GLYPHS[tone]} ` }}</span>{{ heading }}</span>
    <div class="bd-callout-body">
      <slot />
    </div>
  </aside>
</template>
