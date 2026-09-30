<script setup lang="ts">
import { Locale } from '~/interfaces'

const emit = defineEmits<{
  change: [locale: Locale]
}>()

const { t, locale } = useI18n()
const router = useRouter()
const { switchLocale } = useLocaleUtils()

const options: Locale[] = [Locale.SpanishColombia, Locale.English]

async function select(next: Locale): Promise<void> {
  if (next === locale.value) return
  await router.push(switchLocale(next))
  emit('change', next)
}
</script>

<template>
  <div class="bd-seg-group bd-lang" role="group" :aria-label="t('bd.header.language')">
    <button
      v-for="option in options"
      :key="option"
      type="button"
      class="bd-seg"
      :lang="option"
      :aria-label="t(`bd.header.languages.${option}`)"
      :aria-pressed="locale === option ? 'true' : 'false'"
      @click="select(option)"
    >
      {{ option.toUpperCase() }}
    </button>
  </div>
</template>
