<script setup lang="ts">
import type { Tema } from '~/interfaces'

const emit = defineEmits<{
  change: [theme: Tema]
}>()

const { t } = useI18n()
const { tema, setTema } = useTheme()

const options: Tema[] = ['noche', 'dia']

function select(next: Tema, event: MouseEvent): void {
  if (next === tema.value) return
  setTema(next, event.currentTarget)
  emit('change', next)
}
</script>

<template>
  <div class="bd-seg-group" role="group" :aria-label="t('bd.header.theme')">
    <button
      v-for="option in options"
      :key="option"
      type="button"
      :class="['bd-seg', `bd-seg-${option}`]"
      :aria-pressed="tema === option ? 'true' : 'false'"
      @click="select(option, $event)"
    >
      {{ t(`bd.header.${option}`) }}
    </button>
  </div>
</template>
