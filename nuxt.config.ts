import { Locale } from "./app/interfaces/locale";
import { themeInitScript } from "./app/helpers/theme";

export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: true,
  future: {
    compatibilityVersion: 4,
  },
  nitro: {
    static: false,
    preset: "node-server",
    externals: {
      inline: [/nodemailer/],
    },
    devStorage: {
      cache: { driver: 'memory' },
    },
  },
  // Caching strategy (node-server / Docker preset, no CDN in front):
  // - Pages: `isr` renders once and revalidates after the TTL via Nitro's
  //   storage cache. The page HTML embeds the useAsyncData payload, so
  //   visitors of a cached page never trigger Strapi calls.
  // - API routes: `Cache-Control` headers below are defensive; they only
  //   take effect if a shared cache/CDN is introduced later. Do not add
  //   Vercel-only headers (CDN-Cache-Control / Vercel-CDN-Cache-Control).
  routeRules: {
    "/": { isr: 300 },
    "/about": { isr: 3600 },
    "/blog": { isr: 300 },
    "/blog/**": { isr: 300 },
    "/es": { isr: 300 },
    "/es/about": { isr: 3600 },
    "/es/blog": { isr: 300 },
    "/es/blog/**": { isr: 300 },
  },
  modules: ["@nuxt/ui", "@nuxt/image", "@vueuse/nuxt", "@nuxtjs/i18n", "@nuxt/eslint"],
  i18n: {
    locales: [
      { code: Locale.English, iso: "en-US", name: "English", file: "en.json" },
      {
        code: Locale.SpanishColombia,
        iso: "es",
        name: "Español",
        file: "es.json",
      },
    ],
    defaultLocale: Locale.English,
    strategy: "prefix_except_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },
  ui: {
    colorMode: false,
    fonts: false,
  },
  experimental: {
    viewTransition: true,
    payloadExtraction: "client",
  },
  app: {
    head: {
      htmlAttrs: { lang: "en" },
      title: "BogDev - Personal Blog",
      viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
      meta: [
        { name: "author", content: "BogDev" },
        { property: "og:site_name", content: "BogDev" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@devbog" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/bogdev.svg" },
        {
          rel: "alternate",
          type: "application/rss+xml",
          title: "BogDev RSS Feed",
          href: "/feed.xml",
        },
        {
          rel: "preload",
          href: "/fonts/archivo-latin-var.woff2",
          as: "font",
          type: "font/woff2",
          crossorigin: "",
        },
        {
          rel: "preload",
          href: "/fonts/jetbrains-mono-latin-var.woff2",
          as: "font",
          type: "font/woff2",
          crossorigin: "",
        },
      ],
      script: [
        {
          innerHTML: themeInitScript,
          tagPosition: "head",
          tagPriority: "critical",
        },
        {
          defer: true,
          "data-domain": "bogdev.com.co",
          src: "https://plausible.io/js/script.hash.outbound-links.js",
        },
      ],
    },
  },
  image: {
    quality: 80,
    format: ["webp", "avif"],
  },
  runtimeConfig: {
    strapiUrl: "",
    strapiApiToken: process.env.STRAPI_API_TOKEN,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: parseInt(process.env.SMTP_PORT || "587"),
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    newsletterFrom: process.env.NEWSLETTER_FROM,
    public: {
      strapiUrl: process.env.STRAPI_URL || "https://api.bogdev.com.co",
      siteUrl: process.env.SITE_URL || "https://bogdev.com.co",
      fediverseHandle: "@devbog@api.bogdev.com.co",
      fediverseActorUrl: "https://api.bogdev.com.co/fediverse/user/devbog",
    },
  },
  css: ["~/assets/css/main.css"],
});
