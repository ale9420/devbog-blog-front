<script setup lang="ts">
const isSearchOpen = ref(false);
const isMobileMenuOpen = ref(false);

useKeyboardShortcut('k', () => {
    isSearchOpen.value = !isSearchOpen.value
})
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <LayoutSkipLinks />
        <LayoutReadingProgress />
        <LayoutBackToTop />

        <LayoutHeader
            @open-search="isSearchOpen = true"
            @open-mobile-menu="isMobileMenuOpen = true"
        />

        <LayoutMobileMenu
            :is-open="isMobileMenuOpen"
            @close="isMobileMenuOpen = false"
        />

        <LayoutSearchModal :is-open="isSearchOpen" @close="isSearchOpen = false" />

        <main id="main-content" class="flex-1 pt-16 lg:pt-20" role="main">
            <slot />
        </main>

        <LayoutFooter />
    </div>
</template>
