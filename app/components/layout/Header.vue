<script setup lang="ts">
import { Locale } from "~/interfaces";

const { t, locale, locales, setLocale } = useI18n();
const route = useRoute();
const router = useRouter();
const { y: scrollY } = useWindowScroll();
const { localizePath, switchLocale } = useLocaleUtils();
const { isDark, toggle } = useTheme();

const isScrolled = computed(() => scrollY.value > 20);

const availableLocales = computed(() => {
    return (locales.value as Array<{ code: string; name: string }>).filter(
        (l) => l.code !== locale.value,
    );
});

const navLinks = computed(() => {
    const baseLinks = [
        { label: t("nav.home"), path: "/" },
        { label: t("nav.blog"), path: "/blog" },
        { label: t("nav.about"), path: "/about" },
    ];

    return baseLinks.map((link) => ({
        label: link.label,
        to: localizePath(link.path),
    }));
});

function isActive(path: string) {
    const currentPath = route.path;
    if (path === "/" || path === localizePath("/")) {
        return currentPath === localizePath("/");
    }
    return currentPath.startsWith(path);
}

async function handleLocaleSwitch() {
    const newLocale = availableLocales.value[0]?.code as Locale | undefined;
    if (newLocale) {
        const newPath = switchLocale(newLocale);
        await setLocale(newLocale);
        router.push(newPath);
    }
}

const emit = defineEmits<{
    openSearch: [];
    openMobileMenu: [];
}>();
</script>

<template>
    <header
        class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        :class="[isScrolled ? 'glass border-b shadow-sm' : 'bg-transparent']"
    >
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16 lg:h-20">
                <div class="flex items-center gap-8">
                    <NuxtLink
                        :to="localizePath('/')"
                        class="flex items-center gap-3 group"
                    >
                        <NuxtImg
                            src="/bogdev.svg"
                            class="w-10 h-10"
                            alt="BogDev"
                        />
                        <span
                            class="text-xl font-display font-bold hidden sm:block"
                        >
                            <span class="text-[var(--foreground)]">Bog</span
                            ><span class="text-[var(--primary)]">Dev</span>
                        </span>
                    </NuxtLink>

                    <div class="hidden lg:flex items-center gap-1">
                        <NuxtLink
                            v-for="link in navLinks"
                            :key="link.to"
                            :to="link.to"
                            class="relative px-4 py-2 text-sm font-medium transition-colors nav-link"
                            :class="
                                isActive(link.to)
                                    ? 'text-[var(--primary)]'
                                    : 'text-[var(--foreground)] hover:text-[var(--foreground)]'
                            "
                        >
                            {{ link.label }}
                        </NuxtLink>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <button
                        type="button"
                        @click="emit('openSearch')"
                        class="p-2.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-elevated)] transition-all touch-manipulation"
                        :aria-label="t('common.ariaSearch')"
                    >
                        <UIcon
                            name="i-heroicons-magnifying-glass"
                            class="w-5 h-5"
                        />
                    </button>

                    <button
                        type="button"
                        @click="handleLocaleSwitch"
                        class="px-3 py-2 rounded-lg text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-elevated)] transition-all touch-manipulation"
                        :aria-label="t('common.ariaSwitchLocale')"
                    >
                        {{ availableLocales[0]?.name || "EN" }}
                    </button>

                    <button
                        type="button"
                        @click="toggle"
                        class="p-2.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-elevated)] transition-all touch-manipulation"
                        :aria-label="t('common.ariaToggleTheme')"
                    >
                        <UIcon
                            v-show="isDark"
                            name="i-heroicons-sun"
                            class="w-5 h-5 text-[var(--secondary)]"
                        />
                        <UIcon
                            v-show="!isDark"
                            name="i-heroicons-moon"
                            class="w-5 h-5 text-[var(--primary)]"
                        />
                    </button>

                    <button
                        type="button"
                        @click="emit('openMobileMenu')"
                        class="lg:hidden p-2.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-elevated)] transition-all touch-manipulation"
                        :aria-label="t('common.ariaMenu')"
                    >
                        <UIcon name="i-heroicons-bars-3" class="w-5 h-5" />
                    </button>
                </div>
            </div>
        </nav>
    </header>
</template>

<style scoped>
.nav-link::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: var(--primary);
    transition: all 0.3s ease;
    transform: translateX(-50%);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
    width: calc(100% - 2rem);
}
</style>
