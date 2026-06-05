<script setup lang="ts">
const { t } = useI18n()

const props = defineProps<{
  username?: string
}>()

const config = useAppConfig()
const username = props.username || config.site?.support?.buyMeACoffee || 'your-username'
</script>

<template>
  <div class="card p-6 text-center">
    <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-[#ff5f5f]/10 flex items-center justify-center">
      <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" stroke="#ff5f5f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16 16l-4-4-4 4" stroke="#ff5f5f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    
    <h4 class="font-display text-lg font-semibold mb-2">{{ t('buyMeACoffee.supportMyWork') }}</h4>
    <p class="text-sm text-[var(--muted)] mb-4">
      {{ t('buyMeACoffee.description') }}
    </p>
    
    <a
      :href="`https://www.buymeacoffee.com/${username}`"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#ff5f5f] text-white font-medium hover:bg-[#ff3f3f] transition-colors"
    >
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86zm2-15.86c1.03.13 2 .45 2.87.93H13v-.93zM13 7h5.24c.25.31.48.65.68 1H13V7zm0 3h6.74c.08.33.15.66.19 1H13v-1zm0 9.93V19h2.87c-.49.3-1.05.53-1.66.68l-.21-.68H13zm5.13-3.36l-.21-.68C16.98 15.52 15.37 15 13.66 15V12H11v.04c.45-.01.88-.04 1.29-.11l.84-.03z"/>
      </svg>
      {{ t('buyMeACoffee.button') }}
    </a>
  </div>
</template>
