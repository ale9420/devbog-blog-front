---
name: vue3-accessible-components
description: Enforces semantic HTML5, Vue 3 Composition API best practices, and WCAG accessibility standards for UI components.
---

# Vue 3 & Accessible Component Development Skill

When creating, refactoring, or generating Vue 3 components within the Nuxt application, apply strict modern JavaScript/TypeScript standards combined with web accessibility guidelines.

## 1. Vue 3 Composition API Standard
- Use `<script setup>` syntax for all Vue 3 components.
- Enforce explicit type definitions for `defineProps<{...}>()` and `defineEmits<{...}>()` when using TypeScript.
- Utilize Vue 3 shallow reactivity (`shallowRef` or `shallowReactive`) for handling heavy payloads or raw API responses from Strapi that do not require deep mutation tracking.

## 2. Semantic HTML & DOM Structure
- Never use generic `<div>` or `<span>` tags for clickable interactive elements; always use native HTML elements like `<button>` or `<a>`.
- Ensure proper use of document landmarks by implementing structural tags such as `<main>`, `<header>`, `<footer>`, `<nav>`, and `<article>`.

## 3. WCAG Accessibility (a11y) Implementation
- **Aria Attributes:** Dynamically bind critical accessibility attributes such as `aria-expanded`, `aria-controls`, and `aria-selected` based on the reactive component state.
- **Focus Management:** Ensure all custom interactive elements (modals, dropdowns, tabs) are fully navigable via keyboard (`Tab`, `Shift + Tab`, `Enter`, `Space`). Use focus trapping utilities inside modals or overlays.
- **Form Fields:** Every single form input must be linked to a semantic `<label>` using the `for` attribute, or explicitly use `aria-label` / `aria-labelledby` if visual labels are omitted.
