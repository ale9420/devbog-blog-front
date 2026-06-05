---
name: nuxt-hybrid-rendering
description: Configures hybrid rendering (SSR, SSG, ISR) and data fetching optimizations in Nuxt 3 when connecting to an external API like Strapi.
---

# Nuxt 3 Architecture & Hybrid Rendering Skill

When writing code or configuring routes for this Nuxt 3 frontend, apply the following optimization and architecture rules:

## 1. Route Rules Configuration
Configure `routeRules` in `nuxt.config.ts` depending on the content dynamic behavior from Strapi:
- **Static/Marketing Pages:** Use `prerender: true` (SSG).
- **Dynamic Content (Articles/Products):** Use `isr: 60` or `isr: true` (Incremental Static Regeneration) to avoid overloading the Strapi API.
- **User Dashboards / Auth Pages:** Use `ssr: false` (SPA mode).

## 2. Data Fetching Best Practices
- Always use `useFetch` or `useAsyncData` for server-side API calls to prevent double fetching behavior.
- Leverage the `transform` function in `useFetch` to clean up and destructure the Strapi API deep response (`response.data`) before it reaches the Vue component state.
- Implement proper loading and error states using Nuxt's native composable properties (`pending`, `error`).

## 3. Image Optimization
- Enforce the use of `<NuxtImg>` instead of the native standard `<img>` tag for any assets originating from the Strapi Media Library. Set appropriate modifiers for responsive width and formats.
