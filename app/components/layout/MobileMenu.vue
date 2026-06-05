<script setup lang="ts">
const { t, locale } = useI18n()
const { localizePath } = useLocaleUtils()
const appConfig = useAppConfig()

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const route = useRoute()

const navLinks = computed(() => {
  const baseLinks = [
    { label: t('nav.home'), path: '/', icon: 'i-heroicons-home' },
    { label: t('nav.blog'), path: '/blog', icon: 'i-heroicons-document-text' },
    { label: t('nav.about'), path: '/about', icon: 'i-heroicons-user' }
  ]
  
  return baseLinks.map(link => ({
    label: link.label,
    to: localizePath(link.path),
    icon: link.icon
  }))
})

function isActive(path: string) {
  if (path === '/' || path === localizePath('/')) {
    return route.path === '/' || route.path === '/en' || route.path.startsWith('/es')
  }
  return route.path.startsWith(path) || route.path.startsWith(`/${locale.value}`)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="isOpen" class="fixed inset-0 z-[60]">
        <div 
          class="absolute inset-0 backdrop-blur-sm"
          style="background-color: color-mix(in srgb, var(--foreground) 50%, transparent)"
          @click="emit('close')"
        />
        <div class="absolute inset-y-0 right-0 w-full max-w-sm animate-slide-in-right">
          <div class="h-full flex flex-col bg-[var(--surface)] shadow-2xl">
            <div class="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
              <span class="text-lg font-display font-semibold">{{ t('common.menu') }}</span>
              <button 
                @click="emit('close')"
                class="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-elevated)] transition-all"
              >
                <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
              </button>
            </div>
            
            <nav class="flex-1 overflow-y-auto p-6">
              <div class="space-y-2">
                <NuxtLink 
                  v-for="link in navLinks" 
                  :key="link.to" 
                  :to="link.to"
                  @click="emit('close')"
                  class="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all"
                  :class="isActive(link.to) 
                    ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white' 
                    : 'text-[var(--foreground)] hover:bg-[var(--surface-elevated)]'"
                >
                  <UIcon :name="link.icon" class="w-5 h-5" />
                  {{ link.label }}
                </NuxtLink>
              </div>

              <div class="mt-8 pt-8 border-t border-[var(--border)]">
                <h3 class="text-sm font-semibold text-[var(--muted)] mb-4">{{ t('common.connect') }}</h3>
                <a 
                  :href="appConfig.site.social.linkedin" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--foreground)] hover:bg-[var(--surface-elevated)] transition-all"
                >
                  <IconsLinkedInIcon class="text-[var(--brand-linkedin)]" />
                  {{ t('common.ariaLinkedIn') }}
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
</style>
