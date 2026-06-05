<script setup lang="ts">
const { t } = useI18n();
const { localizePath } = useLocaleUtils();
const config = useAppConfig();
const currentYear = new Date().getFullYear();
</script>

<template>
    <footer class="bg-[var(--surface)] text-[var(--foreground)] border-t border-[var(--border)] relative overflow-hidden">
        <img
            src="/copeton.png"
            class="absolute left-0 bottom-0 h-96 w-auto pointer-events-none select-none opacity-[0.08] dark:opacity-[0.12]"
            alt=""
        />
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div class="grid md:grid-cols-4 gap-8 lg:gap-12 mb-12">
                <div class="md:col-span-2">
                    <NuxtLink
                        :to="localizePath('/')"
                        class="flex items-center gap-3 mb-4"
                    >
                        <NuxtImg
                            src="/bogdev.svg"
                            class="w-30 h-30"
                            alt="BogDev"
                        />
                        <span class="text-2xl font-display font-bold">
                            <span class="text-[var(--primary)]">Bog</span
                            ><span class="text-[var(--foreground)]">Dev</span>
                        </span>
                    </NuxtLink>
                    <p class="mb-6 max-w-md text-[var(--muted)]">
                        {{ t("home.hero.subtitle") }}
                    </p>
                    <div class="flex items-center gap-4">
                        <a
                            :href="config.site.social.linkedin"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="w-10 h-10 rounded-full bg-[var(--surface-elevated)] flex items-center justify-center text-[var(--muted)] hover:bg-[var(--brand-linkedin)] hover:text-white transition-colors"
                            :aria-label="t('common.ariaLinkedIn')"
                        >
                            <IconsLinkedInIcon class="w-5 h-5" />
                        </a>
                        <a
                            :href="config.site.social.github"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="w-10 h-10 rounded-full bg-[var(--surface-elevated)] flex items-center justify-center text-[var(--muted)] hover:bg-[var(--brand-github)] hover:text-white transition-colors"
                            :aria-label="t('common.ariaGitHub')"
                        >
                            <IconsGitHubIcon class="w-5 h-5" />
                        </a>
                        <a
                            :href="config.site.social.codeberg"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="w-10 h-10 rounded-full bg-[var(--surface-elevated)] flex items-center justify-center text-[var(--muted)] hover:bg-[var(--brand-codeberg)] hover:text-white transition-colors"
                            :aria-label="t('common.ariaCodeberg')"
                        >
                            <IconsCodebergIcon class="w-5 h-5" />
                        </a>
                        <a
                            :href="config.site.social.mastodon"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="w-10 h-10 rounded-full bg-[var(--surface-elevated)] flex items-center justify-center text-[var(--muted)] hover:bg-[var(--brand-mastodon)] hover:text-white transition-colors"
                            :aria-label="t('common.ariaMastodon')"
                        >
                            <IconsMastodonIcon class="w-5 h-5" />
                        </a>
                    </div>
                </div>

                <div>
                    <h4 class="font-semibold mb-4">
                        {{ t("footer.quickLinks") }}
                    </h4>
                    <ul class="space-y-3">
                        <li>
                            <NuxtLink
                                :to="localizePath('/')"
                                class="text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
                                >{{ t("nav.home") }}</NuxtLink
                            >
                        </li>
                        <li>
                            <NuxtLink
                                :to="localizePath('/blog')"
                                class="text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
                                >{{ t("nav.blog") }}</NuxtLink
                            >
                        </li>
                        <li>
                            <NuxtLink
                                :to="localizePath('/about')"
                                class="text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
                                >{{ t("nav.about") }}</NuxtLink
                            >
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 class="font-semibold mb-4">
                        {{ t("footer.topics") }}
                    </h4>
                    <ul class="space-y-3">
                        <li>
                            <NuxtLink
                                :to="`${localizePath('/blog')}?category=ai`"
                                class="text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
                                >{{
                                    t("footer.artificialIntelligence")
                                }}</NuxtLink
                            >
                        </li>
                        <li>
                            <NuxtLink
                                :to="`${localizePath('/blog')}?category=software`"
                                class="text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
                                >{{ t("footer.softwareDevelopment") }}</NuxtLink
                            >
                        </li>
                        <li>
                            <NuxtLink
                                :to="`${localizePath('/blog')}?category=linux`"
                                class="text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
                                >{{ t("footer.linuxOpenSource") }}</NuxtLink
                            >
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 class="font-semibold mb-4">
                        {{ t("footer.subscribe") }}
                    </h4>
                    <ul class="space-y-3">
                        <li>
                            <a
                                href="/feed.xml"
                                class="text-[var(--muted)] hover:text-[var(--primary)] transition-colors flex items-center gap-2"
                            >
                                <UIcon name="i-heroicons-rss" class="w-4 h-4" />
                                {{ t("footer.rssFeed") }}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div
                class="pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[var(--muted)]"
            >
                <p>&copy; {{ currentYear }} BogDev. {{ t("footer.rights") }}</p>
                <p>
                    {{ t("footer.madeWith") }}
                    <span class="text-[var(--error)]">&hearts;</span>
                    {{ t("footer.bogota") }}
                </p>
            </div>
        </div>
    </footer>
</template>
