import { Locale } from "./app/interfaces/locale";

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
  },
  routeRules: {
    "/": { prerender: true },
    "/about": { prerender: true },
    "/blog": { isr: 300 },
    "/blog/**": { isr: 300 },
    "/es": { prerender: true },
    "/es/about": { prerender: true },
    "/es/blog": { isr: 300 },
    "/es/blog/**": { isr: 300 },
  },
  modules: ["@nuxt/ui", "@nuxt/image", "@vueuse/nuxt", "@nuxtjs/i18n"],
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
  colorMode: {
    preference: "system",
    fallback: "light",
    classSuffix: "",
    storageKey: "devbog-color-mode",
  },
  app: {
    head: {
      htmlAttrs: { lang: "en" },
      title: "BogDev - Personal Blog",
      meta: [
        { name: "author", content: "BogDev" },
        { property: "og:site_name", content: "BogDev" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@devbog" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/bogdev.svg" },
        { rel: "canonical", href: "https://devbog.com" },
        {
          rel: "alternate",
          type: "application/rss+xml",
          title: "BogDev RSS Feed",
          href: "/feed.xml",
        },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Cabin:wght@400;600;700&family=Source+Sans+3:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
        },
      ],
      script: [
        {
          defer: true,
          "data-domain": "devbog.com",
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
    },
  },
  css: ["~/assets/css/main.css"],
});
