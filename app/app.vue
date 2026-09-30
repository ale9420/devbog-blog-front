<script setup lang="ts">
import { defaultLocale, Locale } from "~/interfaces";

const { locale } = useI18n();
const { localePaths } = useLocaleUtils();
const { siteUrl } = useSiteUrl();

const hreflangLinks = computed(() => {
    const paths = localePaths.value;
    const fallback = paths[defaultLocale] ?? paths[locale.value as Locale];
    const hreflangs = [
        ...Object.values(Locale).filter((code) => paths[code]).map((code) => ({ hreflang: code as string, path: paths[code] })),
        ...(fallback ? [{ hreflang: "x-default", path: fallback }] : []),
    ];
    return hreflangs.map(({ hreflang, path }) => ({ rel: "alternate", hreflang, href: `${siteUrl.value}${path}` }));
});

useHead({
    htmlAttrs: {
        lang: () => locale.value as Locale,
    },
    meta: () => [
        { property: 'og:locale', content: locale.value === 'es' ? 'es_CO' : 'en_US' },
    ],
    link: () => hreflangLinks.value,
});
</script>

<template>
    <div>
        <NuxtRouteAnnouncer />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
