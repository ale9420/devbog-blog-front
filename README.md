# BogDev — Personal Blog

A bilingual (English/Spanish) personal blog built with **Nuxt 4** and **Strapi CMS**, following a **JAMStack architecture**. Designed as a modern, SEO-friendly, and accessible blogging platform.

## Features

- **Nuxt 4 SSR** — Server-side rendered for performance and SEO
- **Strapi CMS** — Headless CMS for content management (posts, comments, newsletter)
- **Bilingual** — Full English and Spanish support with URL prefix strategy (`prefix_except_default`)
- **Dark/Light mode** — System-aware theming with manual toggle
- **Commenting system** — Threaded comments with author identification, powered by Strapi
- **Newsletter** — Email subscription with confirmation flow via SMTP (nodemailer)
- **RSS Feed** — Auto-generated `/feed.xml` from published articles
- **Sitemap** — Dynamic XML sitemap with hreflang alternates for SEO
- **Search** — Full-text search across posts with keyboard shortcut (Cmd+K)
- **SEO** — Open Graph, Twitter Cards, JSON-LD structured data, canonical URLs
- **Accessibility** — Skip links, semantic HTML, ARIA labels, keyboard navigation
- **Strapi Blocks** — Rich text, quotes, images, and slider content blocks
- **Analytics** — Self-hosted Umami, served first-party through a Nitro proxy (privacy-friendly)
- **Responsive** — Mobile-first design with Tailwind CSS v4

## Prerequisites

- **Node.js** >= 18
- **Strapi 5** instance (headless CMS backend)
- **SMTP server** (for newsletter emails) — optional

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/devbog-blog-front.git
cd devbog-blog-front
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

All variables are read when the server starts, so the same Docker image works in every environment. Only `NUXT_*` names reach the built server: Nuxt ignores plain names like `STRAPI_API_TOKEN` at runtime.

| Variable | Description | Required |
|----------|-------------|----------|
| `NUXT_PUBLIC_STRAPI_URL` | URL of your Strapi instance (default: `https://api.bogdev.com.co`) | Yes |
| `NUXT_STRAPI_API_TOKEN` | API token from Strapi settings | Yes |
| `NUXT_SMTP_HOST` | SMTP server hostname | Newsletter only |
| `NUXT_SMTP_PORT` | SMTP server port (default: 587) | Newsletter only |
| `NUXT_SMTP_USER` | SMTP username | Newsletter only |
| `NUXT_SMTP_PASS` | SMTP password | Newsletter only |
| `NUXT_NEWSLETTER_FROM` | Sender address for newsletter emails | Newsletter only |
| `NUXT_PUBLIC_SITE_URL` | Public URL of your deployed site (default: `https://bogdev.com.co`) | Yes |
| `NUXT_MEDIA_URL` | Host of the Strapi uploads, allowed in the images Content Security Policy (default: `https://resources.bogdev.com.co`) | No |
| `NUXT_PUBLIC_UMAMI_WEBSITE_ID` | Umami website ID. Empty: no tracker is loaded | Analytics only |
| `NUXT_UMAMI_URL` | Internal Umami URL the proxy forwards to (e.g. `http://<umami-service>:3000`). Empty: no proxy | Analytics only |
| `NUXT_PUBLIC_UMAMI_SCRIPT_PATH` | Tracker path, must match Umami's `TRACKER_SCRIPT_NAME` and stay at the root (default: `/bd.js`) | No |
| `NUXT_UMAMI_COLLECT_PATH` | Collect path, must match Umami's `COLLECT_API_ENDPOINT` (default: `/api/bd`) | No |

The tracker only reports visits whose host matches `NUXT_PUBLIC_SITE_URL`, so local and preview builds never send data. The tracker and its collect endpoint are served from the site itself (`server/middleware/umami.ts`) and forwarded to Umami with the visitor IP in `x-real-ip`, so blockers that filter third-party analytics domains don't drop visits.

### 4. Set up Strapi CMS

This project expects a Strapi 5 instance with the following content types:

#### Posts collection type
| Field | Type | Notes |
|-------|------|-------|
| `title` | Text | |
| `slug` | UID | From title |
| `description` | Text | Short excerpt |
| `content` | Rich Text (blocks) | Legacy markdown support |
| `blocks` | Dynamic Zone | Rich text, quote, media, slider blocks |
| `cover` | Media | Single image |
| `category` | Relation | Categories collection |
| `tags` | JSON | Array of tag strings |
| `readTime` | Integer | Estimated reading time in minutes |
| `publishedAt` | DateTime | Publication date |
| `author` | Relation | Authors collection |

#### Comments plugin
Enable the **Strapi Comments** plugin (or implement the `comments` API endpoints).

#### Newsletter subscribers collection
| Field | Type | Notes |
|-------|------|-------|
| `email` | Email | Subscriber email |
| `token` | Text | Confirmation token |
| `confirmed` | Boolean | Whether confirmed |
| `locale` | Text | Language preference |

### 5. Start the development server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run generate` | Generate static output |
| `npm run typecheck` | Run TypeScript type checking |

## Deployment

### PM2 (recommended for Node servers)

An `ecosystem.config.js` is included for PM2 process management:

```bash
npm run build
pm2 start ecosystem.config.js
```

### Environment variables in production

Set the variables from `.env.example` in the production environment (Dokploy) with their `NUXT_*` names. The image is built in GitHub Actions without any of them, so a plain name like `STRAPI_API_TOKEN` leaves the token empty and every Strapi call goes out without it. The server logs a warning at startup for each required value that is missing.

## Project Structure

```
├── app/
│   ├── app.config.ts          # Site configuration (name, social links, etc.)
│   ├── app.vue                # Root component
│   ├── assets/css/            # Global styles: main.css imports settings/, base/, components/, layout/, pages/, utilities/
│   ├── components/            # Vue components (auto-imported, grouped by feature)
│   │   ├── layout/            # Shell: Header, Footer, MobileMenu, SearchModal, etc.
│   │   ├── home/              # Home page: Hero, Newsletter
│   │   ├── blog/              # Blog: PostCard, Sidebar, Pagination, CommentSection, etc.
│   │   ├── strapi/            # Strapi block renderers: BlocksRenderer, RichTextBlock, etc.
│   │   └── icons/             # SVG icons: LinkedIn, GitHub, Codeberg, Mastodon
│   ├── composables/           # Auto-imported composables
│   │   ├── useStrapi.ts       # Strapi CMS integration
│   │   ├── useComments.ts     # Comment CRUD operations
│   │   ├── useLocaleUtils.ts  # i18n path localization helpers
│   │   ├── useSiteUrl.ts      # Site URL singleton
│   │   ├── useCanonicalUrl.ts # Canonical URL builder
│   │   ├── useKeyboardShortcut.ts  # Cmd/Ctrl+key bindings
│   │   ├── useTheme.ts        # Dark/light theme toggle
│   │   └── useMarkdownRenderer.ts  # Markdown rendering
│   ├── helpers/               # Pure utility functions (explicit imports)
│   │   ├── formatDate.ts      # Date formatting with style presets
│   │   └── string.ts          # String utilities (getInitial, etc.)
│   ├── interfaces/            # TypeScript interfaces and enums
│   ├── layouts/default.vue    # Default layout
│   └── pages/                 # Route pages (file-based routing)
│       ├── index.vue          # Homepage
│       ├── about.vue          # About page
│       ├── blog/              # Blog listing and post pages
│       └── confirm.vue        # Newsletter confirmation
├── i18n/locales/              # Translation files (en.json, es.json)
├── public/                    # Static assets (logos, robots.txt)
├── server/
│   ├── api/                   # API endpoints
│   │   ├── posts/             # Post listing and detail
│   │   ├── comments/          # Comment CRUD
│   │   └── newsletter/        # Subscription and confirmation
│   └── routes/                # Static routes (feed.xml, sitemap.xml, robots.txt)
└── nuxt.config.ts             # Nuxt configuration
```

## Configuration

### Site settings

Edit `app/app.config.ts` to customize:
- Site name, URL, and description
- Social media links (GitHub, LinkedIn, Codeberg, Mastodon)
- Comment provider
- Buy Me a Coffee username

### Strapi API

The Strapi connection is configured via environment variables. See `.env.example` for all options.

### i18n

Translations are in `i18n/locales/`. The project uses `prefix_except_default` strategy — English (default) has no URL prefix, Spanish has `/es`.

### Theming

Colors are CSS custom properties generated from `docs/design/tokens.json` into `app/assets/css/settings/tokens.css` (`npm run tokens`). The `data-theme="noche" | "dia"` attribute on `<html>` switches between the night and day values.

## License

MIT — see [LICENSE](LICENSE).
