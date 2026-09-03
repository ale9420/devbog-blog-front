# BogDev — UI/UX & Performance Improvement Plan

Analysis performed against the deployed site `https://bogdev.com.co/` (Spanish at `/es`) and the codebase under `ale9420/devbog-blog-front`.

Issues are grouped by area and numbered sequentially so they can be opened one by one. Each issue has a suggested title, labels, priority, problem description, and concrete acceptance criteria.

---

## How to open the issues

The `gh` CLI is not available in this environment, so this plan is delivered as a markdown file. To open them in bulk, copy each "**Issue body**" section into a separate file (e.g. `issue-01.md`) and run:

```bash
gh issue create \
  --repo ale9420/devbog-blog-front \
  --title "<title>" \
  --label "<comma separated labels>" \
  --body-file issue-01.md
```

Or use the GitHub web UI → New Issue → Paste body.

Suggested labels to create first (if missing): `bug`, `ui/ux`, `accessibility`, `performance`, `seo`, `security`, `code-quality`, `good first issue`, `enhancement`, `critical`, `priority: high/medium/low`.

---

## Summary table

| # | Area | Title | Priority |
|---|------|-------|----------|
| 01 | Bug | Canonical URLs point to the wrong domain (`devbog.com` instead of `bogdev.com.co`) | Critical |
| 02 | Bug | Open Graph image `/og-image.png` returns 404 on every page | Critical |
| 03 | Bug | Plausible analytics `data-domain` is the wrong domain | Critical |
| 04 | Bug | `PostCard.vue` placeholder shows debug text `D!!!` when a post has no cover | High |
| 05 | Bug | Sidebar category count is concatenated without spacing (`IA1`) | High |
| 06 | Bug | `BuyMeACoffee` link uses placeholder `your-username` | High |
| 07 | Bug | `app.config.ts` `site.author.name` is `"Anonymous"` | Medium |
| 08 | Bug | Mastodon handle mismatch (`@alejo9420` vs `@bogdev`) | Medium |
| 09 | Bug | `MobileMenu.vue` contains a leftover `console.log(path)` | Low |
| 10 | SEO | Sitemap & RSS use the legacy domain `devbog.com` | Critical |
| 11 | SEO | No JSON-LD on home/about pages (Organization, Person, WebSite) | High |
| 12 | SEO | Blog index filters categories/tags client-side instead of via Strapi | Medium |
| 13 | SEO | Hard-coded structured data domain in `[slug].vue` | High |
| 14 | SEO | `robots.txt` is incomplete and lacks the Sitemap directive | High |
| 15 | SEO | `Sitemap` doesn't include locale-aware static pages | Medium |
| 16 | SEO | Feed XML mixes locales without proper `<link rel="alternate">` per item | Medium |
| 17 | Perf | `useStrapi.searchPosts` calls Strapi directly from the client (token leak risk) | Critical |
| 18 | Perf | `searchPosts` should be wrapped in a server endpoint like the other Strapi calls | Critical |
| 19 | Perf | `SearchModal` debounce timer is never cleared on unmount (memory leak) | Medium |
| 20 | Perf | ISR `isr: 300` for blog overlaps with `Cache-Control: s-maxage=300` on the API | Medium |
| 21 | Perf | `categories.get.ts` fetches 200 articles just to count categories | Medium |
| 22 | Perf | `useFetchPosts` asyncData key ignores `pageSize`, `sort`, `category` filters | Medium |
| 23 | Perf | No `decoding="async"` and missing `fetchpriority="high"` on the LCP cover | Medium |
| 24 | Perf | Footer image `copeton.png` (~248 KB) loads on every page | Low |
| 25 | Perf | `ReadingProgress` scroll listener is not throttled | Low |
| 26 | a11y | `SkipLinks` hides itself after 5 seconds — breaks keyboard navigation | High |
| 27 | a11y | `SkipLinks.skipToSearch` searches for `input[type="search"]` that doesn't exist | High |
| 28 | a11y | Search modal lacks a focus trap and ESC inside it conflicts with global Cmd+K | High |
| 29 | a11y | `MobileMenu` has no focus trap, no `aria-modal`, and `role="dialog"` is missing | High |
| 30 | a11y | Home page has no `<h1>`; only an `<h2>` for the featured post | High |
| 31 | a11y | Sidebar category/tag buttons don't expose `aria-pressed` state | Medium |
| 32 | a11y | Table of contents links use `href="#"` — should deep-link to the heading | Medium |
| 33 | a11y | Search modal `role="listbox"` items use `aria-selected` but the wrapper is missing `aria-activedescendant` | Medium |
| 34 | a11y | `CommentSection` errors not linked via `aria-describedby` | Low |
| 35 | UX  | Cmd+K inside the SearchModal closes the modal instead of acting on the input | High |
| 36 | UX  | No "Back to top" appears during the hero / TOC scroll; threshold too high | Low |
| 37 | UX  | Hard-coded `popularTags` in `pages/blog/index.vue` instead of computing from posts | Medium |
| 38 | UX  | `Sidebar.vue` still uses legacy `attributes?.name` API shape (works only by accident) | Medium |
| 39 | UX  | `post.tags` typing in `useStrapi` reads `tags.data` (Strapi v4 shape) but the rest of the code expects v5 | Medium |
| 40 | UX  | `formatDate` is hard-locked to `en-US` locale instead of using the active i18n locale | Medium |
| 41 | Quality | `useMarkdownRenderer` does not sanitize HTML before `v-html` | High |
| 42 | Quality | `marked.use()` mutates the global marked instance | Medium |
| 43 | Quality | Excessive use of `any` in `useStrapi`, `useComments`, `Sidebar`, `SearchModal` | Medium |
| 44 | Quality | `useFetchPosts`, `useFetchPost`, `useFetchAbout`, `useFetchCategories` start with `use` but are not composables | Low |
| 45 | Quality | `comments/[id].delete.ts` & `[id].put.ts` allow editing/deleting without auth check | High |
| 46 | Quality | `Hero.vue` defines a local interface instead of using `~/interfaces` | Low |
| 47 | Quality | `useKeyboardShortcut` registers inside `onMounted` → SSR-incompatible if called in setup | Low |
| 48 | Quality | No tests (unit, integration, e2e) and CI only runs typecheck (no lint) | Medium |
| 49 | i18n | Unused strings in `i18n/locales/*.json` after migrating About to Strapi | Low |
| 50 | i18n | Spanish home page post slug mismatch with English (slug `inicio-del-blog` vs `digital-sovereignty-and-local-labs`) | Medium |

---

## Issue 01 — Canonical URLs point to the wrong domain

**Priority:** Critical · **Labels:** `bug`, `seo`, `critical`

### Problem
Multiple places hard-code `https://devbog.com` while the actual site runs at `https://bogdev.com.co`. This hurts SEO and breaks canonical/hreflang consistency.

### Locations
- `nuxt.config.ts:64` — `<link rel="canonical" href="https://devbog.com">`
- `server/routes/feed.xml.ts:5` — `const baseUrl = "https://devbog.com"`
- `server/routes/sitemap.xml.ts:6` — `const siteUrl = "https://devbog.com"`
- `server/routes/robots.txt.ts:6` — `Sitemap: https://devbog.com/sitemap.xml`
- `app/pages/blog/[slug].vue:75-149` — every `@id`, `url`, `item` in the JSON-LD graph
- `app/composables/useCanonicalUrl.ts:8` — example in JSDoc

### Acceptance criteria
- All canonical URLs derive from `useRuntimeConfig().public.siteUrl` (already `https://bogdev.com.co`).
- `feed.xml` and `sitemap.xml` outputs use `https://bogdev.com.co`.
- JSON-LD on the post page uses `bogdev.com.co`.
- `robots.txt` Sitemap line points to `https://bogdev.com.co/sitemap.xml`.
- Add an integration test that fetches the homepage HTML and asserts the canonical URL equals `https://bogdev.com.co/`.

---

## Issue 02 — Open Graph image `/og-image.png` returns 404

**Priority:** Critical · **Labels:** `bug`, `seo`, `ui/ux`, `critical`

### Problem
`/og-image.png` is referenced by `app/pages/index.vue:26`, `pages/blog/index.vue:117`, and `pages/about.vue:15`. The file does not exist in `public/`, so every share to Twitter / LinkedIn / Slack shows a broken image.

### Evidence
```
HTTP/2 404
content-type: application/json
```

### Acceptance criteria
- Either add `public/og-image.png` (1200×630) with the brand mark, or remove the `ogImage` references and rely on each post's `seo.metaImage`.
- Use `@nuxt/image`'s `ogImage` provider to auto-generate social cards.
- Verify the meta tag `<meta property="og:image" content="...">` resolves to a 200.

---

## Issue 03 — Plausible analytics `data-domain` is wrong

**Priority:** Critical · **Labels:** `bug`, `analytics`, `critical`

### Problem
`nuxt.config.ts:86` has `"data-domain": "devbog.com"` but the real domain is `bogdev.com.co`. Plausible won't track visits.

### Acceptance criteria
- Replace with `"data-domain": "bogdev.com.co"`.
- (Optional) use `useRuntimeConfig().public.siteUrl` host so analytics follow the configured site.
- Confirm in the Plausible dashboard that `bogdev.com.co` shows realtime visits.

---

## Issue 04 — `PostCard.vue` placeholder shows debug text `D!!!`

**Priority:** High · **Labels:** `bug`, `ui/ux`

### Problem
When a post has no `cover.url`, `app/components/blog/PostCard.vue:48` renders `{{ post.title?.charAt(0) }}!!!`. This is visible on the live site (e.g. the post "Digital Sovereignty…" in the home grid shows `D!!!`). Same `!!!` leftover in `app/components/home/Hero.vue` if the featured post has no cover (it currently does, but the fallback is ugly).

### Acceptance criteria
- Remove the `!!!` in both files. Show only the initial letter on a subtle gradient background.
- Use the existing `getInitial` helper from `app/helpers/string.ts` for consistency.

---

## Issue 05 — Sidebar category count concatenated without spacing

**Priority:** High · **Labels:** `bug`, `ui/ux`

### Problem
`app/components/blog/Sidebar.vue:35-41` renders the category name and count in two separate `<span>`s, but the live output shows `IA1` (the post title's first letter `IA` plus count `1`) with no separator. Confirmed visible on `/blog` and `/es/blog`.

### Acceptance criteria
- Add spacing (gap, padding, or visible separator like `·`) between the category name and count.
- Apply the same pattern to the tag pill if a count is shown.

---

## Issue 06 — Buy Me a Coffee link uses placeholder username

**Priority:** High · **Labels:** `bug`, `ui/ux`

### Problem
`app/app.config.ts:21` sets `support.buyMeACoffee: "your-username"`. The blog post footer shows the broken link `https://www.buymeacoffee.com/your-username`.

### Acceptance criteria
- Replace with the real username or hide the component until configured.
- Consider showing a config-validation warning at startup if the placeholder is detected.

---

## Issue 07 — `app.config.ts` author defaults to `"Anonymous"`

**Priority:** Medium · **Labels:** `bug`, `content`

### Problem
`app/app.config.ts:7` — `author.name: "Anonymous"`. This appears in About fallback / social profiles. Should be `Alejandro Ramirez`.

### Acceptance criteria
- Update to the real author name and adjust the URL if needed.

---

## Issue 08 — Mastodon handle mismatch

**Priority:** Medium · **Labels:** `bug`, `content`

### Problem
`app/app.config.ts:15` has `mastodon: "https://mastodon.social/@alejo9420"` but `app/pages/about.vue` shows `@bogdev`. Pick one and align.

### Acceptance criteria
- Decide on the canonical handle. Update both files to match.

---

## Issue 09 — `MobileMenu.vue` contains a leftover `console.log`

**Priority:** Low · **Labels:** `bug`, `code-quality`, `good first issue`

### Problem
`app/components/layout/MobileMenu.vue:42` has `console.log(path);` left from debugging. Should be removed (and add an ESLint rule to forbid `console.*` in `app/`).

### Acceptance criteria
- Remove the log.
- Add `no-console: ["error", { allow: ["warn", "error"] }]` to ESLint config (currently `npm run lint` exists but no config file).

---

## Issue 10 — Sitemap & RSS use the legacy domain

**Priority:** Critical · **Labels:** `bug`, `seo`, `critical`

### Problem
See Issue 01 — the generated feeds serve `https://devbog.com` URLs. Confirmed in live `feed.xml` and `sitemap.xml` output.

### Acceptance criteria
- Centralize the public site URL (use `useSiteUrl()` from a server util that reads `runtimeConfig.public.siteUrl`).
- Use it for `feed.xml`, `sitemap.xml`, `robots.txt`, and any other outbound URL.

---

## Issue 11 — No JSON-LD on home / about pages

**Priority:** High · **Labels:** `enhancement`, `seo`

### Problem
Only the post page emits JSON-LD. The homepage should expose `WebSite` + `Organization`, the about page should expose `Person`.

### Acceptance criteria
- Add a `WebSite` + `Organization` structured data block to `pages/index.vue` (with `SearchAction` pointing to `/blog?search={search_term_string}` like the post page already does).
- Add a `Person` block to `pages/about.vue` using Strapi's SEO + the author info.
- Validate with Google's Rich Results Test and Schema.org Validator.

---

## Issue 12 — Blog index filters categories/tags client-side

**Priority:** Medium · **Labels:** `enhancement`, `seo`, `performance`

### Problem
`pages/blog/index.vue` fetches a page of posts and filters by category/tag in a computed (`filteredPosts`). That means:
- All category results stay in the same 6-post page; nothing else is fetched.
- The URL query changes but pagination doesn't update the underlying Strapi query.
- Search engines see only the first page of all posts, not the filtered subset.

### Acceptance criteria
- Pass `filters[category][name][$eq]=...` and similar tag filters to `useFetchPosts`.
- Reuse the existing `useFetchPosts` with reactive params so changing category re-fetches.
- Cancel in-flight requests on rapid filter changes.
- Update route query when the user picks a category.

---

## Issue 13 — Hard-coded structured data domain in `[slug].vue`

**Priority:** High · **Labels:** `bug`, `seo`

### Problem
`app/pages/blog/[slug].vue` builds the JSON-LD with hard-coded `https://devbog.com/...` strings in lines 75-149. See Issue 01 — fix by using `useSiteUrl()`.

### Acceptance criteria
- All `@id`, `url`, `mainEntityOfPage`, `item`, `publisher.url`, etc. use the configured site URL.

---

## Issue 14 — `robots.txt` is incomplete

**Priority:** High · **Labels:** `bug`, `seo`

### Problem
`server/routes/robots.txt.ts` returns:
```
User-agent: *
          Allow: /
          Sitemap: https://devbog.com/sitemap.xml
```
Two issues:
1. Wrong domain (Issue 01).
2. The literal `Sitemap:` line is preceded by indentation that some crawlers ignore, but the static `public/robots.txt` file is shadowed and the live response lacks `Sitemap`. Actually the live output shows no `Sitemap` line — the Nitro route is being used but only emits `User-agent: *\nAllow: /` (the `Sitemap:` line is in a template string with leading whitespace and a newline that's not preserved as written).

### Acceptance criteria
- Make `robots.txt.ts` return a clean string:
  ```
  User-agent: *
  Allow: /

  Sitemap: https://bogdev.com.co/sitemap.xml
  ```
- Add explicit `Disallow:` for `/api/`, `/confirm`, and Strapi preview routes if needed.

---

## Issue 15 — Sitemap doesn't include locale-aware static pages

**Priority:** Medium · **Labels:** `enhancement`, `seo`

### Problem
Only `/blog`, `/`, `/about` are listed. There are also `/es`, `/es/blog`, `/es/about`. The current `generateUrlEntry` adds both, but `staticPages` only references the unprefixed paths. Also `/confirm` and `/feed.xml` should be referenced but not listed.

### Acceptance criteria
- Verify the en/es alternates for each static page exist in the output.
- Add `<lastmod>` only for the primary locale to avoid noise.

---

## Issue 16 — Feed XML mixes locales without per-item `<link rel="alternate">`

**Priority:** Medium · **Labels:** `enhancement`, `seo`

### Problem
`server/routes/feed.xml.ts` lists every article across both locales but does not include a per-item `<link rel="alternate" hreflang="…">` pointing to the localized version. RSS readers (and Feedly aggregators) cannot deduplicate.

### Acceptance criteria
- Group items by `documentId` (Strapi's stable identifier), emit both languages, and cross-reference with `xhtml:link rel="alternate" hreflang`.
- Filter the feed to a single locale by default and provide a `?lang=es` switch.

---

## Issue 17 — `useStrapi.searchPosts` calls Strapi directly from the client (token leak)

**Priority:** Critical · **Labels:** `bug`, `security`, `critical`

### Problem
`app/composables/useStrapi.ts:86-116` — `searchPosts` calls `${config.public.strapiUrl}/api/articles?...` with the `Authorization: Bearer ${config.strapiApiToken}` header. `strapiApiToken` is declared under `runtimeConfig` (server-only), but the function is invoked from `app/components/layout/SearchModal.vue:42`, which is rendered in the browser. With Nuxt 4, `runtimeConfig.*` (non-public) is **not** exposed to the client, so `config.strapiApiToken` is `undefined` at runtime → the request fails OR, if `public` were used by mistake, the token would be leaked to JS bundles.

Today, this means the **search modal does not actually work in production** (silent 401). Either way, the call must go through a server endpoint.

### Acceptance criteria
- Create `server/api/search.get.ts` that proxies `searchPosts` with the server-side token.
- Update `SearchModal.vue` to `$fetch('/api/search?...')`.
- Add a comment in `useStrapi.ts` clarifying which helpers are server-only.

---

## Issue 18 — `searchPosts` should be wrapped in a server endpoint

**Priority:** Critical · **Labels:** `security`, `performance`, `critical`

### Problem
See Issue 17. Even if the token issue is fixed by using `public.strapiUrl` only, calling Strapi directly from the browser leaks the Strapi URL surface, bypasses the Nuxt cache headers, and can't be rate-limited.

### Acceptance criteria
- Create `server/api/search.get.ts` (similar to `server/api/posts/index.get.ts`) that:
  - Builds the Strapi query with filters.
  - Caches results with `setHeader(event, 'Cache-Control', 'public, s-maxage=60')`.
  - Returns a minimal projection (id, title, slug, description, cover, category).
- Update `SearchModal` to use it.
- Add `Cache-Control` headers.

---

## Issue 19 — `SearchModal` debounce timer is never cleared on unmount

**Priority:** Medium · **Labels:** `bug`, `performance`

### Problem
`app/components/layout/SearchModal.vue:19,36-56` — `let debounceTimer: ReturnType<typeof setTimeout>` is module-local; if the modal closes mid-debounce, the closure still resolves and updates `results.value` after unmount, causing a memory leak and a Vue warning.

### Acceptance criteria
- Move the timer into a `ref` and clear it in the `isOpen` watcher and `onUnmounted`.
- Abort the in-flight `searchPosts` request with an `AbortController` when the modal closes or the query changes.

---

## Issue 20 — ISR overlaps with explicit Cache-Control headers

**Priority:** Medium · **Labels:** `bug`, `performance`

### Problem
`nuxt.config.ts` sets `routeRules: { "/blog/**": { isr: 300 } }`, but `server/api/posts/index.get.ts` and `server/api/posts/[slug].get.ts` set `Cache-Control: public, s-maxage=300`. Both fight each other on Vercel-style deployments. ISR takes the route (the page), while the API cache headers target the JSON. The conflict is benign locally but can cause stale responses and cache invalidation issues when scaling.

### Acceptance criteria
- Document the chosen caching strategy (ISR for pages, SWR for API).
- Remove `CDN-Cache-Control`/`Vercel-CDN-Cache-Control` if not on Vercel, or align values with `routeRules`.
- Add `useRouteRules` comment in `nuxt.config.ts`.

---

## Issue 21 — `categories.get.ts` fetches 200 articles just to count categories

**Priority:** Medium · **Labels:** `enhancement`, `performance`

### Problem
`server/api/categories.get.ts:1-43` calls `/api/articles?pagination[pageSize]=200&populate[category]=...` then builds a Map locally. For a blog with hundreds of posts this fetches more than needed; it should use Strapi's aggregation endpoint or just `/api/categories` directly.

### Acceptance criteria
- Use Strapi's `/api/categories` endpoint with a count, or aggregate via `meta.pagination`.
- Reduce `pageSize` to what's needed for accurate counts.

---

## Issue 22 — `useFetchPosts` asyncData key ignores `pageSize`, `sort`, filters

**Priority:** Medium · **Labels:** `bug`, `performance`

### Problem
`app/composables/useStrapi.ts:13` — the cache key is `posts-${page}-${locale}`. Changing `pageSize`, `sort`, or filters reuses the cached payload, so the UI lies.

### Acceptance criteria
- Hash all params into the key (use `JSON.stringify(params)` or a small hash).
- Or use `watch` on params to re-fetch and invalidate previous data.

---

## Issue 23 — Missing `decoding="async"` and `fetchpriority="high"` on LCP image

**Priority:** Medium · **Labels:** `performance`, `seo`

### Problem
The hero cover image (`app/components/home/Hero.vue:78-87`) is the LCP element. It has `loading="eager"` but no `fetchpriority="high"` and no `decoding="async"`. Same in `app/pages/blog/[slug].vue:272-281`.

### Acceptance criteria
- Add `fetchpriority="high"` on hero/featured covers.
- Add `decoding="async"` on all `NuxtImg` lazy ones.
- Verify with Lighthouse / WebPageTest that LCP improves.

---

## Issue 24 — Footer image `copeton.png` (~248 KB) loads on every page

**Priority:** Low · **Labels:** `performance`, `enhancement`

### Problem
`public/copeton.png` is 247 861 bytes and is referenced in `app/components/layout/Footer.vue:11-14` for every page (decorative). It is `alt=""` but still counts as LCP candidate on some pages.

### Acceptance criteria
- Convert to WebP (use `@nuxt/image`'s `format="webp"` or pre-build).
- Add `loading="lazy"` and `decoding="async"`.
- Or remove it from the blog index page (less critical visually).

---

## Issue 25 — `ReadingProgress` scroll listener is not throttled

**Priority:** Low · **Labels:** `performance`, `good first issue`

### Problem
`app/components/layout/ReadingProgress.vue:9-22` runs `updateProgress()` on every scroll event. While `{ passive: true }` is set, the synchronous React state update can still cause jank on low-end devices.

### Acceptance criteria
- Throttle via `requestAnimationFrame` (similar to what `SliderBlock` does) or use `useScroll` from VueUse.

---

## Issue 26 — `SkipLinks` hides itself after 5 seconds

**Priority:** High · **Labels:** `bug`, `accessibility`

### Problem
`app/components/layout/SkipLinks.vue:20-25` sets `isVisible.value = true` then `setTimeout(() => { isVisible.value = false }, 5000)`. After 5 s the links become `sr-only`. Keyboard users arriving later have no way to discover them.

### Acceptance criteria
- Make the links always visible on focus (default `:focus-within` or `:focus`).
- Remove the 5 s timeout entirely.
- Verify the skip links work for keyboard-only users via manual test or Playwright + `axe`.

---

## Issue 27 — `SkipLinks.skipToSearch` looks for `input[type="search"]` that doesn't exist

**Priority:** High · **Labels:** `bug`, `accessibility`

### Problem
The second skip link targets `input[type="search"], input[placeholder*="Search"]` — neither exists on most pages. The modal's input is added later via Teleport. Focus is never moved.

### Acceptance criteria
- Either remove the "Skip to search" link, or make it dispatch a custom event that `SearchModal` listens to and opens + focuses.

---

## Issue 28 — Search modal lacks focus trap and ESC conflict

**Priority:** High · **Labels:** `bug`, `accessibility`

### Problem
`app/components/layout/SearchModal.vue`:
- Tab can move focus to elements behind the modal.
- `@keydown.escape="emit('close')"` works on the input, but a global Cmd+K listener (line 81-89) only closes — it doesn't toggle.
- No `aria-modal="true"`, no `role="dialog"`, no `aria-labelledby`.

### Acceptance criteria
- Add `role="dialog"` and `aria-modal="true"` to the wrapper.
- Implement a focus trap (Tab cycles inside the modal, Shift+Tab as well).
- Restore focus to the trigger when closed.
- Remove the inner `Cmd+K` global listener (already handled by `useKeyboardShortcut`).
- Trap focus on mount, release on unmount.

---

## Issue 29 — `MobileMenu` has no focus trap and no `aria-modal`

**Priority:** High · **Labels:** `bug`, `accessibility`

### Problem
`app/components/layout/MobileMenu.vue:52-128`:
- No `role="dialog"`, no `aria-modal="true"`, no `aria-labelledby`.
- Focus can leak to the underlying page.
- ESC doesn't close the drawer.

### Acceptance criteria
- Add dialog semantics + focus trap.
- Close on ESC.
- Use `<dialog>` element or `focus-trap` library.

---

## Issue 30 — Home page has no `<h1>`; only an `<h2>` for the featured post

**Priority:** High · **Labels:** `bug`, `accessibility`, `seo`

### Problem
`app/components/home/Hero.vue:41` — the featured post title uses `<h2>`. The home page has no `<h1>` at all (the site title is in `<NuxtImg>` inside `<NuxtLink>`, not in a heading). This breaks document outline and screen-reader navigation.

### Acceptance criteria
- Wrap the site title or a tagline in a visually-hidden `<h1>` (e.g., `<h1 class="sr-only">{{ $t('home.hero.title') }}</h1>`) on the home page.
- Keep the post title as `<h2>`.
- Verify with the headings outline.

---

## Issue 31 — Sidebar category/tag buttons don't expose `aria-pressed`

**Priority:** Medium · **Labels:** `accessibility`, `good first issue`

### Problem
`app/components/blog/Sidebar.vue:30-62` uses `<button>` elements with conditional styling but no `aria-pressed`. Screen readers can't tell which filter is active.

### Acceptance criteria
- Add `:aria-pressed="selectedCategory === category.name"` to category buttons.
- Same for tag pills.

---

## Issue 32 — Table of contents links use `href="#"`

**Priority:** Medium · **Labels:** `accessibility`, `enhancement`

### Problem
`app/components/blog/TableOfContents.vue:95-107` uses `href="#"` with `@click.prevent`. Right-click → "Open in new tab" does nothing. The hash isn't shared.

### Acceptance criteria
- Set `href="#${heading.id}"` (after the heading renders with the slug ID from `useMarkdownRenderer.slugify`).
- Keep the smooth-scroll behavior but ensure SSR works (the IDs must match).

---

## Issue 33 — Search modal `aria-activedescendant` missing

**Priority:** Medium · **Labels:** `accessibility`, `enhancement`

### Problem
`app/components/layout/SearchModal.vue:145` marks the wrapper with `role="listbox"` and items with `aria-selected`, but the input (the `combobox`) doesn't declare `aria-controls="search-results"` nor `aria-activedescendant="result-${id}"`.

### Acceptance criteria
- Add `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant` on the input.
- Add matching `id` on each option.

---

## Issue 34 — `CommentSection` errors not linked via `aria-describedby`

**Priority:** Low · **Labels:** `accessibility`, `good first issue`

### Problem
Error messages are shown via `:style` border color and a `<p>` below the input, but no `aria-describedby`/`aria-invalid`.

### Acceptance criteria
- Add `aria-invalid` + `aria-describedby` referencing the error `<p>` ids.
- Add `role="alert"` to error messages for live announcements.

---

## Issue 35 — Cmd+K inside `SearchModal` closes the modal

**Priority:** High · **Labels:** `bug`, `ux`

### Problem
`SearchModal.vue:81-89` registers a global keydown that calls `emit('close')` on Cmd/Ctrl+K. The intent should be "Cmd+K toggles the modal" — but inside the modal this would unexpectedly close it instead of letting the user keep typing or moving cursor with arrows.

### Acceptance criteria
- Remove the global Cmd+K listener from `SearchModal` (already handled in `default.vue` via `useKeyboardShortcut`).
- Or, only close on Cmd+K when the input is not focused.

---

## Issue 36 — BackToTop threshold too high on short posts

**Priority:** Low · **Labels:** `enhancement`, `ux`

### Problem
`BackToTop.vue:4` — `scrollY.value > 400`. On mobile, this can mean the button never appears on shorter posts.

### Acceptance criteria
- Lower threshold to 200 or use a percentage of viewport height.

---

## Issue 37 — Hard-coded `popularTags` in blog index

**Priority:** Medium · **Labels:** `enhancement`, `ux`

### Problem
`pages/blog/index.vue:40-48` hard-codes `["AI", "Linux", "Vue", "TypeScript", "DevOps", "Python", "Docker"]`. The list never updates with the actual content.

### Acceptance criteria
- Aggregate from `post.tags` server-side (or add a `/api/tags` endpoint).
- Limit to the top 8 by occurrence.
- Keep the fallback list when there are no tags.

---

## Issue 38 — `Sidebar.vue` still uses legacy `attributes?.name` API shape

**Priority:** Medium · **Labels:** `code-quality`, `refactor`

### Problem
`app/components/blog/Sidebar.vue:33,35,39` reads `category.attributes?.name || category.name`. The actual API returns `{ id, name, count }` directly (see `server/api/categories.get.ts:42`). The fallback works only by accident.

### Acceptance criteria
- Read `category.name` directly (no `attributes?.` fallback).
- Add proper TypeScript types for `categories` prop (no `any[]`).

---

## Issue 39 — `post.tags` typing inconsistency (Strapi v4 vs v5)

**Priority:** Medium · **Labels:** `bug`, `code-quality`

### Problem
`pages/blog/index.vue:67` reads `p.tags?.data?.map(t => t.attributes?.name)` — Strapi v4 shape.
But the rest of the code (`post.tags` JSON array, see `useStrapi.ts:43`) suggests v5 (raw `string[]`).

### Acceptance criteria
- Pick one representation. Update `strapi-post.ts` interface and use it everywhere.
- Remove dead branches in blog filtering.

---

## Issue 40 — `formatDate` is hard-locked to `en-US` locale

**Priority:** Medium · **Labels:** `bug`, `i18n`

### Problem
`app/helpers/formatDate.ts:23` — `new Date(date).toLocaleDateString('en-US', options)`. The Spanish site (`/es/blog`) still shows English month names.

### Acceptance criteria
- Read the current locale via `useI18n().locale.value` (or accept it as a parameter) and pass it to `toLocaleDateString`.
- Use `'es-CO'` for Spanish Colombia.
- Verify on `/es/blog`.

---

## Issue 41 — `useMarkdownRenderer` does not sanitize HTML

**Priority:** High · **Labels:** `security`, `code-quality`

### Problem
`app/composables/useMarkdownRenderer.ts` configures `marked` with `gfm: true, breaks: true` and outputs the result via `v-html` in `app/components/strapi/RichTextBlock.vue:12`. Strapi content is editor-controlled, but `marked` allows raw HTML by default. If a future contributor pastes user-generated content (e.g., comments rendered as Markdown), this becomes an XSS sink.

### Acceptance criteria
- Add a sanitizer (e.g., DOMPurify via `isomorphic-dompurify`) and run it before `v-html`.
- Alternatively, parse to a token tree and render with Vue (no `v-html`).
- Add a unit test that `<script>` tags are stripped.

---

## Issue 42 — `marked.use()` mutates the global marked instance

**Priority:** Medium · **Labels:** `code-quality`, `refactor`

### Problem
`useMarkdownRenderer.ts:22-53` calls `marked.use(...)` at module top level. If anything else in the project imports `marked` (or a future plugin does), it inherits these options.

### Acceptance criteria
- Use `new Marked()` (the class API) so options are scoped.
- Or expose a `createRenderer()` factory.

---

## Issue 43 — Excessive use of `any` in Strapi helpers

**Priority:** Medium · **Labels:** `code-quality`, `refactor`

### Problem
`useStrapi.ts`, `useComments.ts`, `Sidebar.vue`, `SearchModal.vue`, `RelatedPosts.vue` rely on `any` (e.g., `categories: any[]`, `(post: any) =>`, `results.value = []`). This defeats the type safety the project claims to enforce.

### Acceptance criteria
- Define typed interfaces in `app/interfaces/` for the search result shape, the categories shape, the related-posts shape, etc.
- Replace every `any` with a named type.
- Run `nuxi typecheck` and fix all remaining `any`.

---

## Issue 44 — `useFetchPosts`, `useFetchPost`, etc. start with `use` but are not composables

**Priority:** Low · **Labels:** `code-quality`, `refactor`

### Problem
These are methods on the `useStrapi()` factory, but Nuxt auto-imports anything starting with `use*` as a composable. This is misleading and can lead to be misuse.

### Acceptance criteria
- Rename to `fetchPosts`, `fetchPost`, etc. inside `useStrapi()`.
- Update all call sites.
- Or wrap each in its own composable file.

---

## Issue 45 — `comments/[id].delete.ts` & `[id].put.ts` have no auth check

**Priority:** High · **Labels:** `security`, `critical`

### Problem
`server/api/comments/[id].delete.ts` and `[id].put.ts` accept arbitrary `authorId` from the query string with no verification. Anyone can edit or delete any comment.

### Acceptance criteria
- Add a session/token check (signed cookie or HMAC of `commentId + authorId`).
- Or rely on Strapi's plugin-level permissions and ensure the proxy forwards the user token from the session.
- Add an integration test that an unauthenticated request returns 401/403.

---

## Issue 46 — `Hero.vue` defines a local interface instead of using `~/interfaces`

**Priority:** Low · **Labels:** `code-quality`, `refactor`, `good first issue`

### Problem
`app/components/home/Hero.vue:5-15` redefines an inline `HeroPost` interface that mirrors `StrapiPost`. Drift is guaranteed.

### Acceptance criteria
- Import `StrapiPost` from `~/interfaces` and use it as the prop type.

---

## Issue 47 — `useKeyboardShortcut` registers inside `onMounted`

**Priority:** Low · **Labels:** `code-quality`, `refactor`

### Problem
`useKeyboardShortcut.ts:11-20` calls `onMounted` and `onUnmounted` inside the composable. While this is fine in a setup context, the handler is only attached client-side. If the user is on the SSR'd page and Cmd+K is pressed before hydration, nothing happens. More importantly, calling the composable in a place where the lifecycle hooks aren't tied to a component will throw.

### Acceptance criteria
- Document the constraint in JSDoc.
- Or use `import.meta.client` guard.

---

## Issue 48 — No tests (unit, integration, e2e) and CI only runs typecheck

**Priority:** Medium · **Labels:** `testing`, `ci`, `enhancement`

### Problem
`package.json` has no `test` script. `.github/workflows/` only runs typecheck + Docker build. With a Strapi backend in the loop, regressions can ship unnoticed.

### Acceptance criteria
- Add Vitest for composables/helpers (e.g., `useCanonicalUrl`, `slugify`, `formatDate`).
- Add `@nuxt/test-utils` for the Nuxt server routes (`search`, `posts/[slug]`, `newsletter/subscribe`).
- Add Playwright e2e for the homepage, blog index, post page, search modal, theme toggle.
- Add ESLint config (currently `npm run lint` runs `nuxi lint` but no `.eslintrc` exists).
- Wire tests into CI.

---

## Issue 49 — Unused i18n strings after migrating About to Strapi

**Priority:** Low · **Labels:** `i18n`, `cleanup`, `good first issue`

### Problem
After the Strapi-driven About migration, the `about.*` namespace in `i18n/locales/{en,es}.json` is mostly dead (`welcome`, `bogotaBased`, `whatIWriteAbout`, `aiDescription`, etc.).

### Acceptance criteria
- Remove unused strings or repurpose them as fallback when Strapi fails.
- Add a `vue-i18n-extract` (or similar) lint to CI to flag unused keys.

---

## Issue 50 — Spanish home page post slug mismatch with English

**Priority:** Medium · **Labels:** `bug`, `seo`

### Problem
The featured post on `/` is `digital-sovereignty-and-local-labs` (English slug), while the same post under `/es` is `inicio-del-blog` (Spanish slug). RSS and sitemap list only `inicio-del-blog` because the feed doesn't filter by locale. Search engines see inconsistent slugs.

### Acceptance criteria
- Decide on a single canonical slug (English or Spanish) and stick to it.
- If both must remain, ensure `hreflang` in the post page's structured data references both URLs.
- Filter `feed.xml` by locale or emit per-locale feeds (`/feed.xml` and `/es/feed.xml`).

---

## Suggested milestones

These issues can be tackled in waves:

- **Wave 1 (correctness blockers):** 01, 02, 03, 10, 14, 17, 18, 45 — all production-impacting bugs that should ship before any marketing push.
- **Wave 2 (UX polish):** 04, 05, 06, 07, 08, 09, 30, 35, 36, 37, 38, 39, 40, 50 — visible bugs and small UX wins.
- **Wave 3 (accessibility):** 26, 27, 28, 29, 31, 32, 33, 34 — keyboard/screen-reader coverage. Helps WCAG compliance.
- **Wave 4 (SEO):** 11, 12, 13, 15, 16, 23 — structured data, locale coverage, performance hints.
- **Wave 5 (performance):** 19, 20, 21, 22, 23, 24, 25 — caching, image optimization, debounce cleanup.
- **Wave 6 (code quality):** 41, 42, 43, 44, 46, 47, 48, 49 — types, tests, refactors.

---

## Quick wins (≤ 30 min each)

If you want to ship something today, these have the highest impact/effort ratio:

1. **Issue 09** — remove `console.log(path)` in `MobileMenu.vue`.
2. **Issue 04** — remove `!!!` from `PostCard.vue` and `Hero.vue`.
3. **Issue 05** — add spacing in `Sidebar.vue`.
4. **Issue 01 + 10** — global find/replace `devbog.com` → `bogdev.com.co` in the listed files.
5. **Issue 03** — change `data-domain` in `nuxt.config.ts`.
6. **Issue 40** — thread the i18n locale into `formatDate`.
7. **Issue 35** — remove the inner Cmd+K handler in `SearchModal.vue`.
