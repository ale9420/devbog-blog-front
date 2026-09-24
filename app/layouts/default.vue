<script setup lang="ts">
import type { HeaderSection } from '~/interfaces'
import { headerSection, isReadingPath } from '~/helpers/header'

const route = useRoute()
const seccion = useHeaderSeccion()

const isSearchOpen = ref(false)
const isMobileMenuOpen = ref(false)

const activa = computed<HeaderSection | undefined>(() => headerSection(route.path))
const lectura = computed<boolean>(() => isReadingPath(route.path))

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
            :activa="activa"
            :lectura="lectura"
            :seccion="seccion || undefined"
            :menu-open="isMobileMenuOpen"
            @search="isSearchOpen = true"
            @menu="isMobileMenuOpen = true"
        />

        <LayoutMobileMenu
            :is-open="isMobileMenuOpen"
            @close="isMobileMenuOpen = false"
        />

        <LayoutSearchModal :is-open="isSearchOpen" @close="isSearchOpen = false" />

        <main id="main-content" class="flex-1" role="main">
            <slot />
        </main>

        <LayoutFooter />
    </div>
</template>
