<script setup lang="ts">
import { Locale } from "~/interfaces";

const { locale } = useI18n();
const route = useRoute();
const { siteUrl } = useSiteUrl();

const hreflangLinks = computed(() => {
    const currentPath = route.path;
    const enPath = currentPath.replace(/^\/es/, "") || "/";
    const esPath = currentPath.startsWith("/es")
        ? currentPath
        : `/es${currentPath === "/" ? "" : currentPath}`;

    return [
        { rel: "alternate", hreflang: "en", href: `${siteUrl}${enPath}` },
        { rel: "alternate", hreflang: "es", href: `${siteUrl}${esPath}` },
        {
            rel: "alternate",
            hreflang: "x-default",
            href: `${siteUrl}${enPath}`,
        },
    ];
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
