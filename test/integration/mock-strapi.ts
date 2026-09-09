import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http'
import qs from 'qs'
import type { RawStrapiArticle, StrapiAuthorRef, StrapiCategoryRef, StrapiMediaRef, StrapiSEO } from '~/interfaces/strapi-post'
import type { StrapiRichText } from '~/interfaces/strapi-blocks'

export interface RecordedRequest {
  method: string
  path: string
  query: Record<string, unknown>
  body?: { data?: Record<string, unknown> }
}

interface MockSubscriber {
  id: number
  documentId: string
  email: string
  confirmationToken: string
  confirmed: boolean
  locale: string
  createdAt: string
  updatedAt: string
}

interface MockStrapiResult {
  server: Server
  url: string
  requests: RecordedRequest[]
}

const author: StrapiAuthorRef = {
  id: 31,
  documentId: 'author-1',
  name: 'Alejandro Ramirez',
  avatar: null,
}

const coverVue: StrapiMediaRef = {
  id: 11,
  documentId: 'cover-vue',
  url: '/uploads/cover-vue.png',
  alternativeText: 'Vue cover',
  width: 1200,
  height: 630,
}

const coverLinux: StrapiMediaRef = {
  id: 12,
  documentId: 'cover-linux',
  url: '/uploads/cover-linux.png',
  alternativeText: 'Linux cover',
  width: 1200,
  height: 630,
}

const coverVueEs: StrapiMediaRef = {
  id: 13,
  documentId: 'cover-vue-es',
  url: '/uploads/cover-vue-es.png',
  alternativeText: 'Vue cover ES',
  width: 1200,
  height: 630,
}

const categoryVue: StrapiCategoryRef = {
  id: 21,
  documentId: 'cat-vue',
  name: 'Vue',
}

const categoryLinux: StrapiCategoryRef = {
  id: 22,
  documentId: 'cat-linux',
  name: 'Linux',
}

const seoVue: StrapiSEO = {
  id: 41,
  metaTitle: 'Vue Composables',
  metaDescription: 'Composables deep dive',
}

const seoLinux: StrapiSEO = {
  id: 42,
  metaTitle: 'Linux Server Hardening',
  metaDescription: 'Linux hardening guide',
}

const blockVue: StrapiRichText = {
  id: 1,
  __component: 'shared.rich-text',
  body: '## Getting Started\n\nComposables let you share stateful logic across components.',
}

const blockLinux: StrapiRichText = {
  id: 2,
  __component: 'shared.rich-text',
  body: '## Basics\n\nStart with SSH key authentication.',
}

const blockVueEs: StrapiRichText = {
  id: 3,
  __component: 'shared.rich-text',
  body: '## Primeros pasos\n\nLos composables permiten compartir lógica.',
}

const articles: RawStrapiArticle[] = [
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

const subscribers: MockSubscriber[] = [
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

function getNestedValue(obj: unknown, path: string[]): unknown {
  let current = obj
  for (const key of path) {
    if (typeof current === 'object' && current !== null && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }
  return current
}

function readJsonBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(body) as Record<string, unknown>)
      } catch {
        resolve({})
      }
    })
  })
}

function sendJson(res: ServerResponse, statusCode: number, payload: unknown): void {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(payload))
}

function sendPng(res: ServerResponse): void {
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    'base64',
  )
  res.writeHead(200, { 'Content-Type': 'image/png' })
  res.end(png)
}

function recordRequest(
  requests: RecordedRequest[],
  method: string,
  path: string,
  query: Record<string, unknown>,
  body: Record<string, unknown> | undefined,
): void {
  const recorded: RecordedRequest = { method, path, query }
  if (body && typeof body === 'object' && 'data' in body) {
    recorded.body = { data: body.data as Record<string, unknown> }
  }
  requests.push(recorded)
}

export async function startMockStrapi(): Promise<MockStrapiResult> {
  const requests: RecordedRequest[] = []

  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const method = req.method || 'GET'
    const url = new URL(req.url || '/', 'http://127.0.0.1')
    const query = qs.parse(url.searchParams.toString())
    const body = method === 'POST' || method === 'PUT' ? await readJsonBody(req) : undefined

    recordRequest(requests, method, url.pathname, query, body)

    if (method === 'GET' && url.pathname === '/api/articles') {
      const slugFilter = getNestedValue(query, ['filters', 'slug', '$eq']) as string | undefined
      const titleFilter = getNestedValue(query, ['filters', 'title', '$containsi']) as string | undefined
      const localeFilter = query.locale as string | undefined
      const categoryFilter = getNestedValue(query, ['filters', 'category', 'name', '$eq']) as string | undefined
      const tagFilter = getNestedValue(query, ['filters', 'tags', '$contains']) as string | undefined
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

      if (titleFilter) {
        const term = titleFilter.toLowerCase()
        const data = articles.filter((article) => article.title.toLowerCase().includes(term))
        sendJson(res, 200, { data })
        return
      }

      let data = [...articles]
      if (localeFilter) {
        data = data.filter((article) => article.locale === localeFilter)
      }
      if (categoryFilter) {
        data = data.filter((article) => article.category?.name === categoryFilter)
      }
      if (tagFilter) {
        data = data.filter((article) => article.tags?.includes(tagFilter))
      }
      data.sort((a, b) => {
        const dateA = new Date(a.publishedAt || 0).getTime()
        const dateB = new Date(b.publishedAt || 0).getTime()
        return dateB - dateA
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
      const localeFilter = getNestedValue(query, ['populate', 'articles', 'filters', 'locale', '$eq']) as string | undefined ?? 'en'
      const categories = [categoryVue, categoryLinux].map((category) => ({
        id: category.id,
        name: category.name,
        articles: articles
          .filter((article) => article.category?.name === category.name && article.locale === localeFilter)
          .map((article) => ({ id: article.id })),
      }))
      sendJson(res, 200, { data: categories })
      return
    }

    if (method === 'GET' && url.pathname === '/api/about') {
      const locale = (query.locale as string | undefined) ?? 'en'
      sendJson(res, 200, {
        data: {
          id: 1,
          documentId: 'about',
          locale,
          blocks: [{ id: 1, __component: 'shared.hero', title: 'About BogDev', subtitle: 'Personal blog' }],
          seo: null,
        },
      })
      return
    }

    if (method === 'GET' && url.pathname === '/api/comments') {
      sendJson(res, 200, { data: [] })
      return
    }

    if (method === 'GET' && url.pathname === '/api/subscribers') {
      const emailFilter = getNestedValue(query, ['filters', 'email', '$eq']) as string | undefined
      const data = subscribers.filter((subscriber) => subscriber.email === emailFilter)
      sendJson(res, 200, { data })
      return
    }

    if (method === 'POST' && url.pathname === '/api/subscribers') {
      const data = body?.data ?? {}
      const now = new Date().toISOString()
      const id = nextSubscriberId++
      const newSubscriber: MockSubscriber = {
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

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      const port = typeof address === 'object' && address !== null ? address.port : 0
      resolve({ server, url: `http://127.0.0.1:${port}`, requests })
    })
  })
}
