# Debug: About page list rendering issue

**Repositories:**
- Backend (Strapi CMS): https://github.com/ale9420/devbog-blog-backend
- Frontend (Nuxt): https://github.com/ale9420/devbog-blog-front

## Symptom

On the About page (`/about`), markdown lists created via the Rich Text block render as indented plain text without visible bullet points.

Rendered output observed (user report):

```
En qué creo

    **Software Libre (FOSS).** Este es uno de los pilares...
    **Comunidad sobre competencia.** La mejor parte...
    **Aprender en público.** Escribir me obliga a entender...
```

## Root cause

The About page was missing the Tailwind Typography `prose` CSS class.

- `app/pages/blog/[slug].vue:262` wraps the block renderer with `class="prose prose-devbog dark:prose-invert max-w-none"`
- `app/pages/about.vue:41` did **not** have this class

Without `prose`, Tailwind's preflight CSS reset (`list-style: none`) applies to `<ul>` elements, hiding bullet points even though the HTML is structurally correct.

The markdown parsing is **not** the problem. `marked` (configured in `app/composables/useMarkdownRenderer.ts`) with `gfm: true` correctly generates `<ul><li>...</li></ul>` HTML. The `RichTextBlock.vue` component renders it via `v-html`, but no CSS styles the output.

## Fix applied

Added the missing `prose` class to the about page:

```diff
- <StrapiBlocksRenderer :blocks="about.blocks" />
+ <StrapiBlocksRenderer class="prose prose-devbog dark:prose-invert max-w-none" :blocks="about.blocks" />
```

## Verification checklist

- [ ] Reload `/about` page — lists should now show bullet points
- [ ] Verify headings (h2, h3) render with proper size and weight
- [ ] Verify bold text (**text**) renders correctly
- [ ] Verify horizontal rules (---) render as visual dividers
- [ ] Verify blockquotes (>) render with proper styling
- [ ] Verify dark mode: bullets, headings, and all typography should adapt via `dark:prose-invert`
- [ ] Verify the `prose-devbog` utility class (`app/assets/css/main.css:4`) provides adequate styling for lists — if custom `list-style-position` or `list-style-type` overrides are needed, add them there

## Related files

| File | Role |
|------|------|
| `app/pages/about.vue` | About page — where the fix was applied |
| `app/components/strapi/RichTextBlock.vue` | Renders `block.body` via `v-html` — no CSS classes applied to its wrapper |
| `app/composables/useMarkdownRenderer.ts` | Markdown → HTML conversion using `marked` with custom renderers — works correctly |
| `app/assets/css/main.css:4` | Defines `@utility prose-devbog` — customize list styles here if needed |
| `app/pages/blog/[slug].vue:262` | Reference: how blog post pages correctly use `prose` |

## Content stored in Strapi (for reference)

The About page `es` locale (`documentId: rslvmvl3uand0d9ilu9obpw8`) has 3 blocks:

1. **Hero** — title: "¡Hola! Soy Alejandro", subtitle: "Escribo sobre desarrollo de software, open source y tecnología"
2. **Rich Text** — body with headings, lists (`*` bullets), bold, horizontal rules, and blockquotes
3. **Social Links** — LinkedIn, GitHub, Codeberg, Mastodon, Twitter

The rich text body uses standard CommonMark list syntax (`* item`) at column 0 with blank line separation before lists. This is confirmed valid markdown.
