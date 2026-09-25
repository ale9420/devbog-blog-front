import { createServer } from 'node:http'
import qs from 'qs'
import { aboutBlocks } from './fixtures/about.mjs'

const author = {
  id: 31,
  documentId: 'author-1',
  name: 'Alejandro Ramirez',
  avatar: null,
}

const coverVue = {
  id: 11,
  documentId: 'cover-vue',
  url: '/uploads/cover-vue.png',
  alternativeText: 'Vue cover',
  width: 1200,
  height: 630,
}

const coverLinux = {
  id: 12,
  documentId: 'cover-linux',
  url: '/uploads/cover-linux.png',
  alternativeText: 'Linux cover',
  width: 1200,
  height: 630,
}

const coverVueEs = {
  id: 13,
  documentId: 'cover-vue-es',
  url: '/uploads/cover-vue-es.png',
  alternativeText: 'Vue cover ES',
  width: 1200,
  height: 630,
}

const categoryVue = {
  id: 21,
  documentId: 'cat-software',
  name: 'Desarrollo de software',
  slug: 'software',
}

const categoryLinux = {
  id: 22,
  documentId: 'cat-linux',
  name: 'Linux y código abierto',
  slug: 'linux',
}

const emptyCategories = [
  { id: 23, documentId: 'cat-privacidad', name: 'Privacidad', slug: 'privacidad' },
  { id: 24, documentId: 'cat-diy', name: 'DIY · Hazlo tú mismo', slug: 'diy' },
  { id: 25, documentId: 'cat-ia', name: 'Inteligencia artificial', slug: 'ia' },
  { id: 26, documentId: 'cat-tutorial', name: 'tutorial', slug: null },
]

const seoVue = {
  id: 41,
  metaTitle: 'Vue Composables',
  metaDescription: 'Composables deep dive',
}

const seoLinux = {
  id: 42,
  metaTitle: 'Linux Server Hardening',
  metaDescription: 'Linux hardening guide',
}

const blockVue = {
  id: 1,
  __component: 'shared.rich-text',
  body: '## Getting Started\n\nComposables let you share stateful logic across components.\n\n```bash\n$ npm create nuxt@latest\n$ npm run dev\n```\n\n### Naming\n\nKeep three habits:\n\n- **Prefix** every composable with `use`.\n- **Return** refs, not raw values.\n- **Clean up** side effects.\n\n> [!NOTE] Analogy\n> A composable is a recipe: the component brings the ingredients.',
}

const blockLinux = {
  id: 2,
  __component: 'shared.rich-text',
  body: '## Basics\n\nStart with SSH key authentication.\n\n```mermaid\nflowchart LR\n  accTitle: SSH login flow\n  A[Client] -->|key| B{Server}\n  B -->|valid| C[Shell]\n  B -->|invalid| D["<img src=x onerror=window.__xss=1>"]\n```\n\n```mermaid\nsequenceDiagram\n  participant C as Client\n  participant S as Server\n  C->>S: Offer public key\n  S-->>C: Challenge\n  Note over C,S: Signed with the private key\n```\n\n```mermaid\nflowchart LR\n  A --> \n```',
}

const blockVueEs = {
  id: 3,
  __component: 'shared.rich-text',
  body: '## Primeros pasos\n\nLos composables permiten compartir lógica.',
}

const comments = [
  {
    id: 101,
    content: 'Great introduction to composables.',
    blocked: false,
    blockedThread: false,
    removed: false,
    author: { id: 'guest-1', name: 'Ana Reader' },
    createdAt: '2026-02-03T10:00:00.000Z',
    updatedAt: '2026-02-03T10:00:00.000Z',
    threadOf: null,
  },
  {
    id: 102,
    content: 'Thanks, glad it helped!',
    blocked: false,
    blockedThread: false,
    removed: false,
    author: { id: 'guest-2', name: 'Alejandro Ramirez' },
    createdAt: '2026-02-04T10:00:00.000Z',
    updatedAt: '2026-02-04T10:00:00.000Z',
    threadOf: { id: 101 },
  },
  {
    id: 103,
    content: 'Replied from Mastodon.',
    blocked: false,
    blockedThread: false,
    removed: false,
    approvalStatus: 'APPROVED',
    author: { id: 'https://mastodon.social/users/bea', name: 'Bea' },
    createdAt: '2026-02-05T10:00:00.000Z',
    updatedAt: '2026-02-05T10:00:00.000Z',
    threadOf: null,
    fediverseActorHandle: '@bea@mastodon.social',
    fediverseUri: 'https://mastodon.social/users/bea/statuses/1',
  },
]

const articles = [
  {
    id: 1,
    documentId: 'doc-vue',
    title: 'Understanding Vue Composables',
    slug: 'understanding-vue-composables',
    description: 'A deep dive into writing reusable Vue composables.',
    content: null,
    publishedAt: '2026-02-01T10:00:00.000Z',
    updatedAt: '2026-02-01T10:00:00.000Z',
    createdAt: '2026-01-20T10:00:00.000Z',
    locale: 'en',
    readTime: 8,
    tags: ['Vue', 'TypeScript'],
    cover: coverVue,
    category: categoryVue,
    author,
    seo: seoVue,
    blocks: [blockVue],
  },
  {
    id: 2,
    documentId: 'doc-linux',
    title: 'Linux Server Hardening Guide',
    slug: 'linux-server-hardening-guide',
    description: 'Practical steps to harden a Linux server.',
    content: null,
    publishedAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z',
    createdAt: '2026-01-10T10:00:00.000Z',
    locale: 'en',
    readTime: 12,
    tags: ['Linux', 'DevOps'],
    cover: coverLinux,
    category: categoryLinux,
    author,
    seo: seoLinux,
    blocks: [blockLinux],
  },
  {
    id: 3,
    documentId: 'doc-vue-es',
    title: 'Guía de Vue Composables',
    slug: 'guia-vue-composables',
    description: 'Una guía profunda sobre composables de Vue.',
    content: null,
    publishedAt: '2026-02-02T10:00:00.000Z',
    updatedAt: '2026-02-02T10:00:00.000Z',
    createdAt: '2026-01-25T10:00:00.000Z',
    locale: 'es',
    readTime: 8,
    tags: ['Vue'],
    cover: coverVueEs,
    category: categoryVue,
    author,
    seo: null,
    blocks: [blockVueEs],
  },
]

let nextSubscriberId = 7

const subscribers = [
  {
    id: 5,
    documentId: 'sub-confirmed',
    email: 'confirmed@example.com',
    confirmationToken: 'token-confirmed',
    confirmed: true,
    locale: 'en',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 6,
    documentId: 'sub-pending',
    email: 'pending@example.com',
    confirmationToken: 'token-pending',
    confirmed: false,
    locale: 'en',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
]

function getNestedValue(obj, path) {
  let current = obj
  for (const key of path) {
    if (typeof current === 'object' && current !== null && key in current) {
      current = current[key]
    } else {
      return undefined
    }
  }
  return current
}

function readJsonBody(req) {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(body))
      } catch {
        resolve({})
      }
    })
  })
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(payload))
}

function sendPng(res) {
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    'base64',
  )
  res.writeHead(200, { 'Content-Type': 'image/png' })
  res.end(png)
}

const server = createServer(async (req, res) => {
  const method = req.method || 'GET'
  const url = new URL(req.url || '/', 'http://127.0.0.1')
  const query = qs.parse(url.searchParams.toString())
  const body = method === 'POST' || method === 'PUT' ? await readJsonBody(req) : undefined

  if (method === 'GET' && url.pathname === '/api/articles/search') {
    const term = String(query.q ?? '').toLowerCase()
    const content = query.content === '1'
    const plainTexts = {
      'doc-vue': 'Composables let you share stateful logic across components.',
      'doc-linux': 'Start with SSH key authentication before anything else.',
      'doc-vue-es': 'Los composables permiten compartir lógica.',
    }
    const data = articles
      .filter((article) => !query.locale || article.locale === query.locale)
      .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())
      .flatMap((article) => {
        const fields = [['title', article.title], ...(content ? [['description', article.description ?? ''], ['content', plainTexts[article.documentId] ?? '']] : [])]
        const hit = fields.find(([, value]) => value.toLowerCase().includes(term))
        if (!hit) return []
        return [{
          documentId: article.documentId,
          slug: article.slug,
          title: article.title,
          description: article.description,
          publishedAt: article.publishedAt,
          locale: article.locale,
          category: article.category ? { slug: article.category.slug, name: article.category.name } : null,
          matchedIn: hit[0],
          snippet: hit[1],
        }]
      })
      .slice(0, Number(query.limit || 10))
    sendJson(res, 200, { data, meta: { query: term, count: data.length } })
    return
  }

  if (method === 'GET' && url.pathname === '/api/articles') {
    const slugFilter = getNestedValue(query, ['filters', 'slug', '$eq'])
    const titleFilter = getNestedValue(query, ['filters', 'title', '$containsi'])
    const localeFilter = query.locale
    const categoryFilter = getNestedValue(query, ['filters', 'category', 'slug', '$eq'])
    const tagFilter = getNestedValue(query, ['filters', 'tags', '$contains'])
    const documentIdFilter = getNestedValue(query, ['filters', 'documentId', '$in'])
    const ascending = query.sort === 'publishedAt:asc'
    const page = Number(getNestedValue(query, ['pagination', 'page']) || 1)
    const pageSize = Number(getNestedValue(query, ['pagination', 'pageSize']) || 10)

    if (slugFilter) {
      const data = articles.filter((article) => {
        const matchesSlug = article.slug === slugFilter
        const matchesLocale = localeFilter ? article.locale === localeFilter : true
        return matchesSlug && matchesLocale
      })
      sendJson(res, 200, { data })
      return
    }

    let data = [...articles]
    if (localeFilter) {
      data = data.filter((article) => article.locale === localeFilter)
    }
    if (categoryFilter) {
      data = data.filter((article) => article.category?.slug === categoryFilter)
    }
    if (titleFilter) {
      const term = titleFilter.toLowerCase()
      data = data.filter((article) => article.title.toLowerCase().includes(term))
    }
    if (tagFilter) {
      data = data.filter((article) => article.tags?.includes(tagFilter))
    }
    if (documentIdFilter) {
      data = data.filter((article) => documentIdFilter.includes(article.documentId))
    }
    data.sort((a, b) => {
      const dateA = new Date(a.publishedAt || 0).getTime()
      const dateB = new Date(b.publishedAt || 0).getTime()
      return ascending ? dateA - dateB : dateB - dateA
    })

    const total = data.length
    const pageCount = Math.ceil(total / pageSize)
    const start = (page - 1) * pageSize
    const pageItems = data.slice(start, start + pageSize)

    sendJson(res, 200, {
      data: pageItems,
      meta: { pagination: { total, page, pageSize, pageCount } },
    })
    return
  }

  if (method === 'GET' && url.pathname === '/api/categories') {
    const localeFilter = getNestedValue(query, ['populate', 'articles', 'filters', 'locale', '$eq']) ?? 'en'
    const categories = [categoryVue, categoryLinux, ...emptyCategories].map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      articles: articles
        .filter((article) => article.category?.slug === category.slug && article.locale === localeFilter)
        .map((article) => ({ id: article.id })),
    }))
    sendJson(res, 200, { data: categories })
    return
  }

  if (method === 'GET' && url.pathname === '/api/about') {
    const locale = query.locale ?? 'en'
    sendJson(res, 200, {
      data: {
        id: 1,
        documentId: 'about',
        locale,
        blocks: aboutBlocks(locale),
        seo: {
          id: 43,
          metaTitle: 'About BogDev',
          metaDescription: 'About the author',
          metaImage: { id: 14, documentId: 'about-og', url: '/uploads/about-og.png' },
        },
      },
    })
    return
  }

  if (method === 'GET' && url.pathname === '/api/fediverse/articles/ranking') {
    const scores = { 'doc-linux': 5, 'doc-vue-es': 7, 'doc-vue': 1 }
    const locale = query.locale ?? 'en'
    const ranked = articles
      .filter((article) => article.locale === locale)
      .filter((article) => !query.category || article.category?.slug === query.category)
      .sort((a, b) => (scores[b.documentId] ?? 0) - (scores[a.documentId] ?? 0))
    const page = Number(query.page || 1)
    const pageSize = Number(query.pageSize || 6)
    sendJson(res, 200, {
      data: ranked.slice((page - 1) * pageSize, page * pageSize).map((article) => ({ documentId: article.documentId })),
      meta: { pagination: { page, pageSize, pageCount: Math.ceil(ranked.length / pageSize), total: ranked.length } },
    })
    return
  }

  if (method === 'GET' && url.pathname === '/api/fediverse/articles/stats') {
    const ids = String(query.documentIds ?? '').split(',')
    sendJson(res, 200, ids.includes('doc-vue-es') ? { 'doc-vue-es': { likes: 7, boosts: 3, replies: 0 } } : {})
    return
  }

  if (method === 'GET' && url.pathname === '/api/fediverse/articles/doc-vue-es/stats') {
    sendJson(res, 200, { likes: 7, boosts: 3 })
    return
  }

  if (method === 'GET' && url.pathname.startsWith('/api/comments')) {
    const data = url.pathname.includes('doc-vue/') ? comments : []
    sendJson(res, 200, { data })
    return
  }

  if (method === 'POST' && url.pathname.startsWith('/api/comments')) {
    sendJson(res, 200, { data: {} })
    return
  }

  if (method === 'GET' && url.pathname === '/api/subscribers') {
    const emailFilter = getNestedValue(query, ['filters', 'email', '$eq'])
    const data = subscribers.filter((subscriber) => subscriber.email === emailFilter)
    sendJson(res, 200, { data })
    return
  }

  if (method === 'POST' && url.pathname === '/api/subscribers') {
    const data = body?.data ?? {}
    const now = new Date().toISOString()
    const id = nextSubscriberId++
    const newSubscriber = {
      id,
      documentId: `sub-${id}`,
      email: String(data.email || ''),
      confirmationToken: String(data.confirmationToken || ''),
      confirmed: Boolean(data.confirmed),
      locale: String(data.locale || 'en'),
      createdAt: now,
      updatedAt: now,
    }
    subscribers.push(newSubscriber)
    sendJson(res, 201, { data: newSubscriber })
    return
  }

  if (method === 'DELETE' && url.pathname.startsWith('/api/subscribers/')) {
    const documentId = url.pathname.split('/').pop()
    const index = subscribers.findIndex((subscriber) => subscriber.documentId === documentId)
    if (index !== -1) {
      subscribers.splice(index, 1)
    }
    sendJson(res, 200, { data: {} })
    return
  }

  if (method === 'GET' && url.pathname.startsWith('/uploads/')) {
    sendPng(res)
    return
  }

  sendJson(res, 404, { error: { status: 404, message: 'Not found' } })
})

const port = process.env.MOCK_PORT || 4310
server.listen(port, '127.0.0.1')
