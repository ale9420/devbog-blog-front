<script setup lang="ts">
import type { HeaderSection } from '~/interfaces'
import { headerSection, isReadingPath } from '~/helpers/header'

const route = useRoute()
const section = useHeaderSection()

const isSearchOpen = ref(false)
const isMobileMenuOpen = ref(false)

const active = computed<HeaderSection | undefined>(() => headerSection(route.path))
const reading = computed<boolean>(() => isReadingPath(route.path))

useKeyboardShortcut('k', () => {
    isSearchOpen.value = !isSearchOpen.value
})

onMounted(() => {
    window.addEventListener('skip-to-search', () => {
        isSearchOpen.value = true
    })
})
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <LayoutSkipLinks />
        <LayoutBackToTop />

        <BdHeader
            :active="active"
            :reading="reading"
            :section="section || undefined"
            :menu-open="isMobileMenuOpen"
            @search="isSearchOpen = true"
            @menu="isMobileMenuOpen = true"
        />

        <BdMenuSheet
            :open="isMobileMenuOpen"
            :active="active"
            @close="isMobileMenuOpen = false"
        />

        <LayoutSearchModal :is-open="isSearchOpen" @close="isSearchOpen = false" />

        <main id="main-content" class="flex-1" role="main">
            <slot />
        </main>

        <LayoutFooter />

        <BdTabBar
            :active="active"
            :menu-open="isMobileMenuOpen"
            @search="isSearchOpen = true"
            @menu="isMobileMenuOpen = true"
        />
    </div>
</template>
