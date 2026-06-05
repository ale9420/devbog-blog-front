<script setup lang="ts">
const { t } = useI18n();
const { localizePath } = useLocaleUtils();
const { siteUrl } = useSiteUrl();
const { canonicalUrl } = useCanonicalUrl('/about');
const appConfig = useAppConfig();

const techStack = [
  "Vue.js",
  "Nuxt",
  "TypeScript",
  "Node.js",
  "Flutter",
  "Docker",
  "NGINX",
  "Linux",
  "PostgreSQL",
  "Strapi",
  "Tailwind CSS",
  "Git",
];



useSeoMeta({
  title: "About - BogDev",
  ogTitle: "About - BogDev",
  description:
    "Software developer based in Bogotá, Colombia. Passionate about AI, Linux, and building great software. Learn more about my journey.",
  ogDescription:
    "Software developer based in Bogotá, Colombia. Passionate about AI, Linux, and building great software. Learn more about my journey.",
  ogImage: "/og-image.png",
  ogUrl: () => canonicalUrl.value,
  ogType: "profile",
  twitterCard: "summary",
  twitterTitle: "About - BogDev",
  twitterDescription:
    "Software developer based in Bogotá, Colombia. Passionate about AI, Linux, and building great software.",
});
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
    <div class="text-center mb-12">
      <div
        class="w-32 h-32 mx-auto mb-6 rounded-full gradient-bogota flex items-center justify-center text-white text-6xl font-display font-bold shadow-lg"
      >
        A
      </div>
      <h1 class="font-display text-4xl lg:text-5xl font-bold mb-4">
        {{ t("about.title") }}
      </h1>
      <p class="text-xl text-[var(--muted)]">
        {{ t("about.developer") }}
      </p>
    </div>

    <div class="card p-8 lg:p-12 mb-8">
      <div class="prose-custom">
        <p>
          {{ t("about.welcome") }}
        </p>

        <h2 class="mt-6">{{ t("about.background") }}</h2>
        <p>
          {{ t("about.bogotaBased") }}
        </p>

        <h2 class="mt-6 mb-3">{{ t("about.whatIWriteAbout") }}</h2>
        <div class="grid sm:grid-cols-2 gap-4 not-prose">
          <div class="p-4 rounded-lg bg-[var(--surface-elevated)]">
            <div
              class="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center mb-3"
            >
              <UIcon
                name="i-heroicons-cpu-chip"
                class="w-5 h-5 text-[var(--primary)]"
              />
            </div>
            <h3 class="font-semibold mb-1">
              {{ t("about.artificialIntelligence") }}
            </h3>
            <p class="text-sm text-[var(--muted)]">
              {{ t("about.aiDescription") }}
            </p>
          </div>
          <div class="p-4 rounded-lg bg-[var(--surface-elevated)]">
            <div
              class="w-10 h-10 rounded-lg bg-[var(--secondary)]/10 flex items-center justify-center mb-3"
            >
              <UIcon
                name="i-heroicons-code-bracket"
                class="w-5 h-5 text-[var(--secondary)]"
              />
            </div>
            <h3 class="font-semibold mb-1">
              {{ t("about.softwareDevelopment") }}
            </h3>
            <p class="text-sm text-[var(--muted)]">
              {{ t("about.softwareDescription") }}
            </p>
          </div>
          <div class="p-4 rounded-lg bg-[var(--surface-elevated)]">
            <div
              class="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-3"
            >
              <UIcon
                name="i-heroicons-command-line"
                class="w-5 h-5 text-green-500"
              />
            </div>
            <h3 class="font-semibold mb-1">{{ t("about.linuxOpenSource") }}</h3>
            <p class="text-sm text-[var(--muted)]">
              {{ t("about.linuxDescription") }}
            </p>
          </div>
          <div class="p-4 rounded-lg bg-[var(--surface-elevated)]">
            <div
              class="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3"
            >
              <UIcon name="i-heroicons-cloud" class="w-5 h-5 text-blue-500" />
            </div>
            <h3 class="font-semibold mb-1">{{ t("about.devopsCloud") }}</h3>
            <p class="text-sm text-[var(--muted)]">
              {{ t("about.devopsDescription") }}
            </p>
          </div>
        </div>

        <h2 class="mt-6">{{ t("about.connect") }}</h2>
        <p>
          {{ t("about.feelFree") }}
        </p>
        <div class="flex flex-wrap gap-4 not-prose mt-2">
          <a
            :href="appConfig.site.social.linkedin"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--brand-linkedin)] hover:text-white transition-colors"
          >
            <IconsLinkedInIcon />
            LinkedIn
          </a>
          <a
            :href="appConfig.site.social.github"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--brand-github)] hover:text-white transition-colors"
          >
            <IconsGitHubIcon class="w-5 h-5" />
            GitHub
          </a>
          <a
            :href="appConfig.site.social.codeberg"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--brand-codeberg)] hover:text-white transition-all"
          >
            <IconsCodebergIcon />
            Codeberg
          </a>
          <a
            :href="appConfig.site.social.mastodon"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--brand-mastodon)] hover:text-white transition-colors"
          >
            <IconsMastodonIcon />
            Mastodon
          </a>
        </div>
      </div>
    </div>

    <div class="card p-8 gradient-bogota-subtle">
      <h3 class="font-display text-xl font-semibold mb-4">
        {{ t("about.techStack") }}
      </h3>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tech in techStack"
          :key="tech"
          class="px-3 py-1.5 rounded-full text-sm bg-[var(--surface)] border border-[var(--border)]"
        >
          {{ tech }}
        </span>
      </div>
    </div>
  </div>
</template>
