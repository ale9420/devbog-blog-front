<script setup lang="ts">
import type { InstanceError } from '~/interfaces'
import { followUrl, normalizeInstance } from '~/helpers/fediverse'
import { padCount } from '~/helpers/search'

const COPIED_MS = 1600

const { t } = useI18n()
const config = useRuntimeConfig()
const { copy, copied } = useClipboard({ copiedDuring: COPIED_MS, legacy: true })

const instance = ref('')
const error = ref<InstanceError | null>(null)

const handle = computed<string>(() => config.public.fediverseHandle)
const handleParts = computed<{ user: string, domain: string }>(() => {
  const at = handle.value.lastIndexOf('@')
  return { user: handle.value.slice(0, at), domain: handle.value.slice(at) }
})
const preview = computed<string | undefined>(() => normalizeInstance(instance.value).domain)
const hint = computed<string>(() => {
  if (error.value === 'empty') return t('home.fediverse.errorEmpty')
  if (error.value === 'invalid') return t('home.fediverse.errorInvalid')
  if (preview.value) return t('home.fediverse.willOpen', { instance: preview.value })
  return t('home.fediverse.hint')
})
const steps = computed<{ title: string, text: string }[]>(() => [
  { title: t('home.fediverse.steps.follow.title'), text: t('home.fediverse.steps.follow.text', { handle: handle.value }) },
  { title: t('home.fediverse.steps.read.title'), text: t('home.fediverse.steps.read.text') },
  { title: t('home.fediverse.steps.reply.title'), text: t('home.fediverse.steps.reply.text') },
])

function copyHandle(): void {
  copy(handle.value)
}

function follow(): void {
  const result = normalizeInstance(instance.value)
  error.value = result.error ?? null
  if (!result.domain) return
  instance.value = result.domain
  window.open(followUrl(result.domain, config.public.fediverseActorUrl), '_blank', 'noopener,noreferrer')
}

watch(instance, () => {
  error.value = null
})
</script>

<template>
  <section id="fediverso" class="bd-home-section bd-fedi bd-reveal" aria-labelledby="fediverse-title">
    <div class="bd-home-head bd-fedi-head">
      <div class="bd-home-heading">
        <p class="bd-eyebrow bd-home-eyebrow">{{ t('home.fediverse.eyebrow') }}</p>
        <h2 id="fediverse-title" class="bd-home-title bd-stretch">{{ t('home.fediverse.title') }}</h2>
      </div>
      <p class="bd-home-intro bd-fedi-intro">{{ t('home.fediverse.intro') }}</p>
    </div>

    <div class="bd-fedi-card">
      <span class="bd-corner bd-corner-tl" aria-hidden="true" />
      <span class="bd-corner bd-corner-br" aria-hidden="true" />
      <div class="bd-fedi-card-head">
        <span class="bd-eyebrow bd-fedi-accent">{{ t('home.fediverse.ring') }}</span>
        <svg width="56" height="32" viewBox="0 0 56 32" aria-hidden="true" focusable="false">
          <ellipse cx="14" cy="16" rx="8" ry="13" fill="none" stroke="var(--chillon)" stroke-width="1.25" />
          <path d="M14 3 L44 3 M14 29 L44 29" stroke="var(--chillon)" stroke-width="1.25" />
          <path d="M44 3 A8 13 0 0 1 44 29" fill="none" stroke="var(--chillon)" stroke-width="1.25" />
          <path d="M24 12 L38 12 M24 16 L34 16 M24 20 L38 20" stroke="var(--ink-muted)" stroke-width="1" />
        </svg>
      </div>

      <div class="bd-fedi-handle-row">
        <p class="font-mono bd-fedi-handle">
          <span class="bd-fedi-user">{{ handleParts.user }}</span><span class="bd-fedi-domain">{{ handleParts.domain }}</span>
        </p>
        <div class="bd-fedi-copy">
          <button type="button" class="bd-chip" :aria-label="t('home.fediverse.copyAria', { handle })" @click="copyHandle">
            {{ copied ? t('home.fediverse.copied') : t('home.fediverse.copy') }}
          </button>
          <span class="bd-meta bd-fedi-note">{{ t('home.fediverse.searchIt') }}</span>
          <span class="bd-sr" aria-live="polite">{{ copied ? t('home.fediverse.copiedAnnounce', { handle }) : '' }}</span>
        </div>
      </div>

      <form class="bd-fedi-form" novalidate @submit.prevent="follow">
        <label for="bd-fedi-instance" class="bd-eyebrow bd-home-eyebrow">{{ t('home.fediverse.instanceLabel') }}</label>
        <div class="bd-fedi-row">
          <input
            id="bd-fedi-instance"
            v-model="instance"
            class="bd-input"
            type="text"
            inputmode="url"
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
            placeholder="mastodon.social"
            :aria-invalid="error ? 'true' : undefined"
            aria-describedby="bd-fedi-hint"
          >
          <BdButton type="submit" arrow>{{ t('home.fediverse.follow') }}</BdButton>
        </div>
        <p id="bd-fedi-hint" :class="['bd-meta bd-fedi-hint', { 'bd-fedi-hint-error': error }]" role="status">{{ hint }}</p>
      </form>

      <p class="bd-meta bd-fedi-note">{{ t('home.fediverse.compat') }}</p>
    </div>

    <div class="bd-fedi-side">
      <ol class="bd-fedi-steps">
        <li v-for="(step, index) in steps" :key="step.title">
          <span class="bd-fedi-step-number" aria-hidden="true">{{ padCount(index + 1) }}</span>
          <div>
            <p class="bd-fedi-step-title">{{ step.title }}</p>
            <p class="bd-fedi-step-text">{{ step.text }}</p>
          </div>
        </li>
      </ol>
      <svg class="bd-fedi-flow" width="480" height="132" viewBox="0 0 480 132" role="img" :aria-label="t('home.fediverse.flow.label')">
        <g font-family="JetBrains Mono, monospace" letter-spacing=".08em" text-anchor="middle">
          <rect x="0.5" y="44.5" width="104" height="44" fill="var(--surface-raised)" stroke="var(--line-strong)" />
          <text x="52" y="71" font-size="12" font-weight="500" fill="var(--ink)">BOGDEV</text>
          <rect x="355.5" y="44.5" width="124" height="44" fill="var(--surface-raised)" stroke="var(--line-strong)" />
          <text x="417" y="71" font-size="12" font-weight="500" fill="var(--ink)">{{ t('home.fediverse.flow.instance') }}</text>
          <text x="230" y="22" font-size="11" fill="var(--ink-muted)">{{ t('home.fediverse.flow.articles') }}</text>
          <text x="230" y="126" font-size="11" fill="var(--ink-muted)">{{ t('home.fediverse.flow.back') }}</text>
        </g>
        <g fill="none" stroke="var(--chillon)" stroke-width="1.4">
          <path d="M112 56 Q230 20 346 56" />
          <path d="M338 50 L347 56 L337 60" />
          <path class="bd-flight-route" d="M346 78 Q230 114 112 78" stroke-opacity=".7" />
          <path d="M121 73 L112 78 L122 83" />
        </g>
        <path d="M222 40 Q226 34 230 39 Q234 34 238 40" fill="none" stroke="var(--ink)" stroke-width="1.4" stroke-linecap="round" />
      </svg>
    </div>
  </section>
</template>
