# AGENTS.md

This file contains instructions and guidelines for agentic coding agents working in this repository.

## Project Overview

This is a Nuxt 4 personal blog application (BogDev) with:
- Nuxt 4 + Vue 3 + TypeScript frontend
- Server-side API routes (Nitro)
- Strapi CMS integration for content
- i18n support (English, Spanish)
- Tailwind CSS with custom CSS variables for theming

## Build/Lint/Test Commands

```bash
# Install dependencies
npm install

# Development
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Production build
npm run preview      # Preview production build locally

# Type checking and linting
npm run typecheck    # Run Nuxt type checking
npm run lint         # Run Nuxt linting (if configured)

# Generate static site
npm run generate     # Generate static output
```

## Code Style Guidelines

### General Conventions

- **No comments**: Do not add code comments unless explicitly requested
- **TypeScript**: Always use explicit types for props, function parameters, and return values
- **Vue 3 Composition API**: Use `<script setup lang="ts">` syntax for all components
- **Script setup order**: Imports → Props/Emits → Composables → Reactive state → Computed → Functions → Lifecycle hooks

### File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `PostCard.vue`, `CommentSection.vue` |
| Pages | kebab-case | `blog/index.vue`, `about.vue` |
| Composables | camelCase with `use` prefix | `useStrapi.ts`, `useComments.ts` |
| Interfaces | camelCase | `post.ts`, `strapi-post.ts` |
| Server routes | kebab-case with HTTP method | `index.get.ts`, `[slug].get.ts` |
| API endpoints | kebab-case with method suffix | `posts/[slug].get.ts`, `comments/index.post.ts` |

### TypeScript Guidelines

- Always use explicit return types for composables
- Use `defineProps<T>()` with generic syntax for component props
- Use `defineEmits<{ event: [paramType] }>()` for emits
- Prefer interfaces over types for object shapes
- Export interfaces from `app/interfaces/` directory

### Vue Component Guidelines

```vue
<script setup lang="ts">
// 1. Imports
import type { Post } from '~/interfaces'

// 2. Props (use generic defineProps)
const props = defineProps<{
  post: Post
  index?: number
}>()

// 3. Emits
const emit = defineEmits<{
  action: [value: string]
}>()

// 4. Composables (auto-imported by Nuxt)
const { t } = useI18n()
const config = useRuntimeConfig()

// 5. Reactive state
const isOpen = ref(false)

// 6. Computed
const formattedDate = computed(() => { ... })

// 7. Functions (use function keyword, not arrow for methods)
function handleClick() {
  emit('action', 'value')
}
</script>

<template>
  <!-- Template content -->
</template>

<style scoped>
/* Scoped styles only */
</style>
```

### CSS/Styling Conventions

- Use CSS custom properties for theme colors: `var(--primary)`, `var(--foreground)`, `var(--muted)`
- Use Tailwind utility classes as base, supplemented with custom CSS
- Use `.card` class for card components with hover effects
- Use `.btn-primary` and `.btn-secondary` for buttons
- Use `.input-field` for form inputs
- Use `font-display` class for serif fonts
- Use `font-mono` class for monospace fonts

### i18n Guidelines

- Store locale files in `i18n/locales/` as JSON
- Use `useI18n()` composable for translations
- Access translations with `t('namespace.key')`
- All user-facing strings must be translated

### API/Server Guidelines

- Server routes go in `server/api/` or `server/routes/`
- Use `$fetch` for internal API calls
- Return proper HTTP status codes with `createError()`
- Use `useRuntimeConfig()` for configuration access

### Error Handling

- Use Nuxt's `createError()` for server-side errors
- Handle async operations with try/catch in server routes
- Return null for "not found" cases rather than throwing

### Accessibility

- Always include `aria-label` on interactive elements without visible text
- Use semantic HTML elements
- Include `<SkipLinks />` component for keyboard navigation
- Ensure color contrast meets WCAG guidelines

### SEO

- Use `useSeoMeta()` on page components for meta tags
- Include Open Graph and Twitter Card meta tags

## Project Structure

```
app/
├── app.config.ts        # App-wide configuration
├── app.vue              # Root component
├── assets/css/          # Global styles (main.css)
├── components/          # Vue components (auto-imported)
├── composables/         # Composables (auto-imported)
├── interfaces/          # TypeScript interfaces
├── layouts/             # Page layouts
└── pages/               # Route pages
    ├── index.vue        # Home (/)
    ├── about.vue        # About (/about)
    └── blog/
        ├── index.vue    # Blog list (/blog)
        └── [slug].vue   # Blog post (/blog/:slug)

server/
├── api/                 # API routes
│   ├── comments/        # Comment CRUD endpoints
│   └── posts/           # Post endpoints
└── routes/              # Static routes (feed.xml, sitemap, robots.txt)

i18n/locales/            # Translation files
content/                 # Nuxt Content (markdown)
public/                  # Static assets
```

## Key Dependencies

- `@nuxt/ui` - UI components
- `@nuxt/content` - Markdown content
- `@nuxt/image` - Image optimization
- `@nuxtjs/i18n` - Internationalization
- `@nuxtjs/google-fonts` - Google Fonts
- `@vueuse/nuxt` - VueUse composables
