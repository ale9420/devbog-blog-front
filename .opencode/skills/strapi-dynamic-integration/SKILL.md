---
name: strapi-dynamic-integration
description: Guides content modeling in Strapi and handles dynamic component binding or Page Builder orchestration on the Nuxt 3 frontend.
---

# Strapi CMS & Dynamic Component Integration Skill

This skill governs how data architectures are structured within Strapi CMS and how they map directly to Vue components on the Nuxt frontend.

## 1. Dynamic Zones and Page Builders
- When mapping Strapi "Dynamic Zones" to Nuxt, use Vue's dynamic component tag: `<component :is="resolvedComponent" :data="block" />`.
- Ensure there is a robust utility or mapping dictionary that associates the Strapi component nomenclature (e.g., `shared.banner`) to the native Nuxt component name (e.g., `LazyBlocksBanner`).

## 2. Strapi API Client & Authentication
- Utilize the official `@nuxtjs/strapi` module methods (`useStrapiClient`, `useStrapiAuth`) to structure queries.
- When querying deeply nested structures or relations in Strapi v4/v5, always explicitly define the `populate` parameter using a clean object syntax instead of the string wildcard `populate=*`.
- Secure authenticated views via Nuxt application-level Middleware (`middleware/auth.ts`) by checking the existence of the Strapi JWT token.

## 3. Webhooks & Cache Invalidation
- When a content modification occurs in Strapi, orchestrate a production build or trigger an ISR invalidation on the hosting provider (Vercel, Netlify, or custom VPS) utilizing Strapi's native Webhook engine.
