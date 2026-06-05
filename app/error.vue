<script setup lang="ts">
const { t } = useI18n()
const { localizePath } = useLocaleUtils()

const props = defineProps<{
  error: {
    statusCode?: number
    message?: string
  }
}>()

const handleError = () => clearError({ redirect: '/' })

useSeoMeta({
  title: () => props.error.statusCode === 404 ? 'Page Not Found - BogDev' : 'Error - BogDev',
  robots: 'noindex',
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="text-center max-w-md">
      <div class="w-32 h-32 mx-auto mb-8 rounded-full gradient-bogota-subtle flex items-center justify-center">
        <span class="text-6xl font-display font-bold text-[var(--primary)]">
          {{ error.statusCode || 404 }}
        </span>
      </div>
      
      <h1 class="text-3xl font-display font-bold mb-4">
        {{ error.statusCode === 404 ? t('error.pageNotFound') : t('error.somethingWentWrong') }}
      </h1>
      
      <p class="text-[var(--muted)] mb-8">
        {{ error.statusCode === 404 
          ? t('error.notExist')
          : t('error.unexpected')
        }}
      </p>
      
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          @click="handleError"
          class="btn-primary"
        >
          <UIcon name="i-heroicons-home" class="w-4 h-4 mr-2" />
          {{ t('error.goHome') }}
        </button>
        <NuxtLink :to="localizePath('/blog')" class="btn-secondary">
          <UIcon name="i-heroicons-document-text" class="w-4 h-4 mr-2" />
          {{ t('error.browseBlog') }}
        </NuxtLink>
      </div>
      
      <div class="mt-12 p-4 rounded-lg bg-[var(--surface-elevated)]">
        <p class="text-sm text-[var(--muted)]">
          {{ t('error.contactSupport') }}
        </p>
      </div>
    </div>
  </div>
</template>
