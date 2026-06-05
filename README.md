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
- **Analytics** — Plausible analytics integration (privacy-friendly)
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

| Variable | Description | Required |
|----------|-------------|----------|
| `STRAPI_URL` | URL of your Strapi instance | Yes |
| `STRAPI_API_TOKEN` | API token from Strapi settings | Yes |
| `SMTP_HOST` | SMTP server hostname | Newsletter only |
| `SMTP_PORT` | SMTP server port (default: 587) | Newsletter only |
| `SMTP_USER` | SMTP username | Newsletter only |
| `SMTP_PASS` | SMTP password | Newsletter only |
| `NEWSLETTER_FROM` | Sender address for newsletter emails | Newsletter only |
| `SITE_URL` | Public URL of your deployed site | Yes |

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

Ensure all environment variables from `.env` are set in your production environment.

## Project Structure

```
├── app/
│   ├── app.config.ts          # Site configuration (name, social links, etc.)
│   ├── app.vue                # Root component
│   ├── assets/css/main.css    # Global styles (Tailwind CSS v4 + custom properties)
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

Colors are defined as CSS custom properties in `app/assets/css/main.css`. The `.dark` class variant overrides them for dark mode.

## License

MIT — see [LICENSE](LICENSE).
