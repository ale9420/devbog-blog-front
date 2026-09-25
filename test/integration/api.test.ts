import { beforeEach, describe, expect, it } from 'vitest'
import { $fetch, fetch, setup } from '@nuxt/test-utils/e2e'
import type { RawStrapiArticle } from '~/interfaces/strapi-post'
import { Category } from '~/interfaces/design'
import { startMockStrapi } from './mock-strapi'

const SITE_URL = 'https://bogdev.test'

const mock = await startMockStrapi()
process.env.STRAPI_URL = mock.url
process.env.NUXT_PUBLIC_STRAPI_URL = mock.url
process.env.NUXT_SMTP_PORT = '1'
process.env.SITE_URL = SITE_URL
process.env.NUXT_PUBLIC_SITE_URL = SITE_URL

await setup({
  server: true,
  setupTimeout: 600_000,
  nuxtConfig: {
    nitro: { prerender: { crawlLinks: false } },
  },
})

beforeEach(() => {
  mock.requests.length = 0
})

describe('/api/categories', () => {
  it('returns the five redesign categories in order, including empty ones, and hides unknown empty ones', async () => {
    const result = await $fetch<Array<{ slug: string | null; name: string; count: number }>>('/api/categories', { query: { locale: 'en' } })
    expect(result.map((category) => [category.slug, category.count])).toEqual([
      [Category.Privacy, 0],
      [Category.Diy, 0],
      [Category.Ai, 0],
      [Category.Software, 1],
      [Category.Linux, 1],
    ])
  })

  it('counts articles of the requested locale only', async () => {
    const result = await $fetch<Array<{ slug: string | null; count: number }>>('/api/categories', { query: { locale: 'es' } })
    expect(result.find((category) => category.slug === Category.Software)?.count).toBe(1)
    expect(result.find((category) => category.slug === Category.Linux)?.count).toBe(0)
  })
})

describe('/api/posts category filter', () => {
  it('filters by category slug', async () => {
    const result = await $fetch<{ data: Array<{ slug: string }> }>('/api/posts', { query: { locale: 'en', category: Category.Linux } })
    expect(result.data.map((post) => post.slug)).toEqual(['linux-server-hardening-guide'])
    const strapiRequests = mock.requests.filter((request) => request.method === 'GET' && request.path === '/api/articles')
    expect(getNestedValue(strapiRequests[strapiRequests.length - 1].query, ['filters', 'category', 'slug', '$eq'])).toBe(Category.Linux)
  })
})

describe('/api/posts sort', () => {
  type PostsPage = { data: Array<{ documentId: string }>; meta: { pagination: { page: number; pageSize: number; total: number; pageCount: number } } }
  const ids = (response: PostsPage) => response.data.map((post) => post.documentId)

  it('sorts by newest first by default and for unknown values', async () => {
    expect(ids(await $fetch<PostsPage>('/api/posts', { query: { locale: 'en' } }))).toEqual(['doc-vue', 'doc-linux'])
    expect(ids(await $fetch<PostsPage>('/api/posts', { query: { locale: 'en', sort: 'recent' } }))).toEqual(['doc-vue', 'doc-linux'])
    expect(ids(await $fetch<PostsPage>('/api/posts', { query: { locale: 'en', sort: 'popular' } }))).toEqual(['doc-vue', 'doc-linux'])
    const upstream = mock.requests.filter((request) => request.path === '/api/articles')
    expect(upstream.every((request) => request.query.sort === 'publishedAt:desc')).toBe(true)
  })

  it('sorts by oldest first', async () => {
    const response = await $fetch<PostsPage>('/api/posts', { query: { locale: 'en', sort: 'oldest' } })
    expect(ids(response)).toEqual(['doc-linux', 'doc-vue'])
    expect(mock.requests.find((request) => request.path === '/api/articles')?.query.sort).toBe('publishedAt:asc')
  })

  it('sorts by fediverse conversation with the backend ranking, page by page', async () => {
    const first = await $fetch<PostsPage>('/api/posts', { query: { locale: 'en', sort: 'fediverse', page: 1, pageSize: 1 } })
    const second = await $fetch<PostsPage>('/api/posts', { query: { locale: 'en', sort: 'fediverse', page: 2, pageSize: 1 } })
    expect(ids(first)).toEqual(['doc-linux'])
    expect(ids(second)).toEqual(['doc-vue'])
    expect(second.meta.pagination).toEqual({ page: 2, pageSize: 1, pageCount: 2, total: 2 })

    const ranking = mock.requests.filter((request) => request.path === '/api/fediverse/articles/ranking')
    expect(ranking.map((request) => request.query)).toEqual([
      { page: '1', pageSize: '1', locale: 'en' },
      { page: '2', pageSize: '1', locale: 'en' },
    ])
  })

  it('passes the category and search filters to the ranking', async () => {
    const response = await $fetch<PostsPage>('/api/posts', { query: { locale: 'en', sort: 'fediverse', category: 'software', search: 'vue' } })
    expect(ids(response)).toEqual(['doc-vue'])
    const ranking = mock.requests.find((request) => request.path === '/api/fediverse/articles/ranking')
    expect(ranking?.query).toMatchObject({ category: 'software', search: 'vue' })
  })

  it('falls back to newest first when the ranking fails', async () => {
    const response = await $fetch<PostsPage>('/api/posts', { query: { locale: 'en', sort: 'fediverse', search: 'fail' } })
    expect(response.data).toEqual([])
    expect(mock.requests.find((request) => request.path === '/api/articles')?.query.sort).toBe('publishedAt:desc')
  })
})

describe('content search', () => {
  type PostsPage = { data: Array<{ documentId: string; snippet?: string | null }>; meta: { pagination: { total: number } } }

  it('searches only titles by default', async () => {
    expect(await $fetch('/api/search', { query: { q: 'ssh', locale: 'en' } })).toEqual([])
    const upstream = mock.requests.find((request) => request.path === '/api/articles/search')
    expect(upstream?.query).toEqual({ q: 'ssh', locale: 'en', limit: '10' })
  })

  it('also searches descriptions and bodies with content=1 and returns the snippet', async () => {
    const results = await $fetch<Array<Record<string, unknown>>>('/api/search', { query: { q: 'ssh', locale: 'en', content: '1' } })
    expect(results).toEqual([{
      documentId: 'doc-linux',
      slug: 'linux-server-hardening-guide',
      title: 'Linux Server Hardening Guide',
      description: expect.any(String),
      publishedAt: '2026-01-15T10:00:00.000Z',
      category: { slug: 'linux', name: 'Linux y código abierto' },
      matchedIn: 'content',
      snippet: 'Start with SSH key authentication.',
    }])
    expect(mock.requests.find((request) => request.path === '/api/articles/search')?.query).toMatchObject({ content: '1' })
  })

  it('does not call the backend for short queries', async () => {
    expect(await $fetch('/api/search', { query: { q: 'ss', content: '1' } })).toEqual([])
    expect(mock.requests.some((request) => request.path === '/api/articles/search')).toBe(false)
  })

  it('lists the blog posts whose body matches, with the snippet', async () => {
    const response = await $fetch<PostsPage>('/api/posts', { query: { locale: 'en', search: 'ssh', content: '1' } })
    expect(response.data.map((post) => post.documentId)).toEqual(['doc-linux'])
    expect(response.data[0]?.snippet).toBe('Start with SSH key authentication.')
    const articles = mock.requests.find((request) => request.path === '/api/articles')
    expect(articles?.query.filters).toEqual({ documentId: { $in: ['doc-linux'] } })

    const titlesOnly = await $fetch<PostsPage>('/api/posts', { query: { locale: 'en', search: 'ssh' } })
    expect(titlesOnly.data).toEqual([])
  })

  it('keeps the category filter and the sort with content search', async () => {
    const recent = await $fetch<PostsPage>('/api/posts', { query: { locale: 'en', search: 'with', content: '1' } })
    expect(recent.data.map((post) => post.documentId)).toEqual(['doc-vue', 'doc-linux'])

    const oldest = await $fetch<PostsPage>('/api/posts', { query: { locale: 'en', search: 'with', content: '1', sort: 'oldest' } })
    expect(oldest.data.map((post) => post.documentId)).toEqual(['doc-linux', 'doc-vue'])

    const fediverse = await $fetch<PostsPage>('/api/posts', { query: { locale: 'en', search: 'with', content: '1', sort: 'fediverse', pageSize: 1, page: 2 } })
    expect(fediverse.data.map((post) => post.documentId)).toEqual(['doc-vue'])
    expect(fediverse.meta.pagination.total).toBe(2)

    const linux = await $fetch<PostsPage>('/api/posts', { query: { locale: 'en', search: 'with', content: '1', category: 'linux' } })
    expect(linux.data.map((post) => post.documentId)).toEqual(['doc-linux'])
  })

  it('returns an empty page when nothing matches', async () => {
    const response = await $fetch<PostsPage>('/api/posts', { query: { locale: 'en', search: 'kubernetes', content: '1' } })
    expect(response.data).toEqual([])
    expect(response.meta.pagination.total).toBe(0)
    expect(mock.requests.some((request) => request.path === '/api/articles')).toBe(false)
  })
})

describe('/api/posts search', () => {
  it('filters titles from three letters on and combines with the category', async () => {
    const result = await $fetch<{ data: Array<{ slug: string }> }>('/api/posts', { query: { locale: 'en', search: 'vue', category: Category.Software } })
    expect(result.data.map((post) => post.slug)).toEqual(['understanding-vue-composables'])
    const strapiRequests = mock.requests.filter((request) => request.method === 'GET' && request.path === '/api/articles')
    expect(getNestedValue(strapiRequests[strapiRequests.length - 1].query, ['filters', 'title', '$containsi'])).toBe('vue')
  })

  it('ignores searches shorter than three letters', async () => {
    await $fetch('/api/posts', { query: { locale: 'en', search: 'vu' } })
    const strapiRequests = mock.requests.filter((request) => request.method === 'GET' && request.path === '/api/articles')
    expect(getNestedValue(strapiRequests[strapiRequests.length - 1].query, ['filters', 'title', '$containsi'])).toBeUndefined()
  })
})

describe('/api/reading-path', () => {
  it('follows the editorial pathOrder of the category', async () => {
    const path = await $fetch('/api/reading-path', { query: { category: 'linux', locale: 'en' } })
    expect(path).toEqual({
      category: 'linux',
      editorial: true,
      steps: [{ documentId: 'doc-linux', slug: 'linux-server-hardening-guide', title: 'Linux Server Hardening Guide' }],
    })
    const request = mock.requests.find((item) => item.path === '/api/articles')
    expect(request?.query).toMatchObject({
      filters: { category: { slug: { $eq: 'linux' } }, pathOrder: { $notNull: 'true' } },
      sort: ['pathOrder:asc', 'publishedAt:asc'],
      locale: 'en',
    })
  })

  it('falls back to publication date when no article of the category has a pathOrder', async () => {
    const path = await $fetch<{ editorial: boolean; steps: Array<{ documentId: string }> }>('/api/reading-path', { query: { category: 'software', locale: 'es' } })
    expect(path.editorial).toBe(false)
    expect(path.steps.map((step) => step.documentId)).toEqual(['doc-vue-es'])
    expect(mock.requests.filter((item) => item.path === '/api/articles').at(-1)?.query.sort).toBe('publishedAt:asc')
  })

  it('falls back to publication date when Strapi does not know pathOrder yet', async () => {
    const path = await $fetch<{ editorial: boolean }>('/api/reading-path', { query: { category: 'linux', locale: 'legacy' } })
    expect(path.editorial).toBe(false)
  })

  it('rejects unknown categories without calling Strapi', async () => {
    await expect($fetch('/api/reading-path', { query: { category: 'cooking' } })).rejects.toMatchObject({ response: { status: 400 } })
    await expect($fetch('/api/reading-path')).rejects.toMatchObject({ response: { status: 400 } })
    expect(mock.requests.some((item) => item.path === '/api/articles')).toBe(false)
  })
})

describe('RSS feeds', () => {
  async function feed(path: string): Promise<{ status: number; type: string | null; cache: string | null; body: string }> {
    const response = await fetch(path)
    return {
      status: response.status,
      type: response.headers.get('content-type'),
      cache: response.headers.get('cache-control'),
      body: await response.text(),
    }
  }

  function items(body: string): string[] {
    return [...body.matchAll(/<item>[\s\S]*?<title><!\[CDATA\[(.*?)\]\]><\/title>/g)].map((match) => match[1]!)
  }

  it('keeps the full feed in English and Spanish, now also at /es/feed.xml', async () => {
    const english = await feed('/feed.xml')
    expect(english.status).toBe(200)
    expect(english.type).toBe('application/rss+xml; charset=utf-8')
    expect(english.cache).toBe('public, s-maxage=1800, stale-while-revalidate=3600')
    expect(english.body).toContain('<title>BogDev - Personal Blog</title>')
    expect(english.body).toContain(`<atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>`)
    expect(items(english.body)).toEqual(['Understanding Vue Composables', 'Linux Server Hardening Guide'])

    const spanish = await feed('/es/feed.xml')
    const legacy = await feed('/feed.xml?lang=es')
    expect(spanish.status).toBe(200)
    expect(spanish.body.replace(/<lastBuildDate>.*<\/lastBuildDate>/, '')).toBe(legacy.body.replace(/<lastBuildDate>.*<\/lastBuildDate>/, ''))
    expect(spanish.body).toContain('<title>BogDev - Personal Blog (Español)</title>')
    expect(items(spanish.body)).toEqual(['Guía de Vue Composables'])
  })

  it('serves one feed per category with only its articles, in each language', async () => {
    const linux = await feed('/feed/linux.xml')
    expect(linux.status).toBe(200)
    expect(linux.type).toBe('application/rss+xml; charset=utf-8')
    expect(linux.cache).toBe('public, s-maxage=1800, stale-while-revalidate=3600')
    expect(linux.body).toContain('<title>BogDev - Linux and open source</title>')
    expect(linux.body).toContain('<description>BogDev articles about Linux and open source, from Bogotá, Colombia.</description>')
    expect(linux.body).toContain(`<link>${SITE_URL}/blog?category=linux</link>`)
    expect(linux.body).toContain(`<atom:link href="${SITE_URL}/feed/linux.xml" rel="self" type="application/rss+xml"/>`)
    expect(linux.body).toContain(`<atom:link href="${SITE_URL}/es/feed/linux.xml" rel="alternate" type="application/rss+xml" hreflang="es"/>`)
    expect(items(linux.body)).toEqual(['Linux Server Hardening Guide'])

    const software = await feed('/es/feed/software.xml')
    expect(software.status).toBe(200)
    expect(software.body).toContain('<title>BogDev - Desarrollo de software</title>')
    expect(software.body).toContain('<language>es-co</language>')
    expect(software.body).toContain(`<atom:link href="${SITE_URL}/es/feed/software.xml" rel="self" type="application/rss+xml"/>`)
    expect(items(software.body)).toEqual(['Guía de Vue Composables'])

    const request = mock.requests.filter((item) => item.path === '/api/articles').at(-1)
    expect(request?.query).toMatchObject({ locale: 'es', filters: { category: { slug: { $eq: 'software' } } } })
  })

  it('returns a valid empty feed for a category without articles', async () => {
    const privacy = await feed('/feed/privacidad.xml')
    expect(privacy.status).toBe(200)
    expect(privacy.body).toContain('<title>BogDev - Privacy</title>')
    expect(privacy.body).not.toContain('<item>')
    expect(privacy.body.trim().endsWith('</channel>\n</rss>')).toBe(true)
  })

  it('answers 404 for unknown categories or files without calling Strapi', async () => {
    expect((await feed('/feed/cooking.xml')).status).toBe(404)
    expect((await feed('/es/feed/cooking.xml')).status).toBe(404)
    expect((await feed('/feed/linux.json')).status).toBe(404)
    expect(mock.requests.some((item) => item.path === '/api/articles')).toBe(false)
  })
})

describe('/api/search', () => {
  it('returns an empty array when q is missing', async () => {
    const result = await $fetch('/api/search')
    expect(result).toEqual([])
  })

  it('returns an empty array when q is shorter than 3 characters', async () => {
    const result = await $fetch('/api/search', { query: { q: 'vu' } })
    expect(result).toEqual([])
  })

  it('returns projected results for a matching query, newest first', async () => {
    const result = await $fetch('/api/search', { query: { q: 'composables' } })
    expect(result).toEqual([
      {
        documentId: 'doc-vue-es',
        title: 'Guía de Vue Composables',
        slug: 'guia-vue-composables',
        description: 'Una guía profunda sobre composables de Vue.',
        publishedAt: '2026-02-02T10:00:00.000Z',
        category: { name: 'Desarrollo de software', slug: Category.Software },
        matchedIn: 'title',
        snippet: 'Guía de Vue Composables',
      },
      {
        documentId: 'doc-vue',
        title: 'Understanding Vue Composables',
        slug: 'understanding-vue-composables',
        description: 'A deep dive into writing reusable Vue composables.',
        publishedAt: '2026-02-01T10:00:00.000Z',
        category: { name: 'Desarrollo de software', slug: Category.Software },
        matchedIn: 'title',
        snippet: 'Understanding Vue Composables',
      },
    ])
  })

  it('searches only the requested locale', async () => {
    const result = await $fetch<Array<{ slug: string }>>('/api/search', { query: { q: 'composables', locale: 'es' } })
    expect(result.map((post) => post.slug)).toEqual(['guia-vue-composables'])
    const upstream = mock.requests.filter((request) => request.path === '/api/articles/search')
    expect(upstream.at(-1)?.query.locale).toBe('es')
  })

  it('returns an empty array when the backend search fails', async () => {
    expect(await $fetch('/api/search', { query: { q: 'fail-search' } })).toEqual([])
  })
})

describe('/api/posts/[slug]', () => {
  it('returns the full article for a known slug', async () => {
    const result = await $fetch<RawStrapiArticle>('/api/posts/understanding-vue-composables', { query: { locale: 'en' } })
    expect(result.title).toBe('Understanding Vue Composables')
    expect(result.slug).toBe('understanding-vue-composables')
    expect(result.blocks).toHaveLength(1)
    expect(result.category?.slug).toBe(Category.Software)
  })

  it('sets revalidation cache headers', async () => {
    let cacheControl = ''
    await $fetch('/api/posts/understanding-vue-composables', {
      query: { locale: 'en' },
      onResponse: (context: { response: { headers: { get: (name: string) => string | null } } }) => {
        cacheControl = context.response.headers.get('cache-control') || ''
      },
    })
    expect(cacheControl).toContain('s-maxage=300')
  })

  it('returns 404 for an unknown slug', async () => {
    await expect($fetch('/api/posts/unknown-slug')).rejects.toMatchObject({ response: { status: 404 } })
  })
})

describe('/api/about', () => {
  it('answers 502 with the Strapi message when Strapi rejects the query', async () => {
    await expect($fetch('/api/about', { query: { locale: 'invalid' } })).rejects.toMatchObject({
      response: { status: 502 },
      data: { message: 'Invalid key about.profile at blocks.on.about.profile' },
    })
  })
})

describe('/api/fediverse/stats', () => {
  it('returns likes and boosts of several federated articles in one request', async () => {
    const response = await fetch('/api/fediverse/stats?documentIds=doc-vue-es,doc-linux,doc-missing')
    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toBe('public, s-maxage=60, stale-while-revalidate=120')
    expect(await response.json()).toEqual({
      'doc-vue-es': { likes: 4, boosts: 2 },
      'doc-linux': { likes: 0, boosts: 1 },
    })
    const upstream = mock.requests.filter((request) => request.path === '/api/fediverse/articles/stats')
    expect(upstream).toHaveLength(1)
    expect(upstream[0]?.query.documentIds).toBe('doc-vue-es,doc-linux,doc-missing')
  })

  it('rejects missing, malformed or too many ids without calling the backend', async () => {
    const tooMany = Array.from({ length: 51 }, (_, index) => `doc-${index}`).join(',')
    await expect($fetch('/api/fediverse/stats')).rejects.toMatchObject({ response: { status: 400 } })
    await expect($fetch('/api/fediverse/stats', { query: { documentIds: 'doc-vue-es,../admin' } })).rejects.toMatchObject({ response: { status: 400 } })
    await expect($fetch('/api/fediverse/stats', { query: { documentIds: tooMany } })).rejects.toMatchObject({ response: { status: 400 } })
    expect(mock.requests.some((request) => request.path.startsWith('/api/fediverse'))).toBe(false)
  })

  it('answers 502 when the backend fails', async () => {
    await expect($fetch('/api/fediverse/stats', { query: { documentIds: 'doc-broken' } })).rejects.toMatchObject({ response: { status: 502 } })
  })
})

describe('/api/fediverse/stats/[documentId]', () => {
  it('returns the likes and boosts of a federated article with a short cache', async () => {
    const response = await fetch('/api/fediverse/stats/doc-vue-es')
    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toBe('public, s-maxage=60, stale-while-revalidate=120')
    expect(await response.json()).toEqual({ likes: 4, boosts: 2 })
    expect(mock.requests.map((request) => request.path)).toContain('/api/fediverse/articles/doc-vue-es/stats')
  })

  it('answers 404 when the article is not federated', async () => {
    await expect($fetch('/api/fediverse/stats/doc-missing')).rejects.toMatchObject({ response: { status: 404 } })
  })

  it('answers 502 when the backend fails', async () => {
    await expect($fetch('/api/fediverse/stats/doc-broken')).rejects.toMatchObject({ response: { status: 502 } })
  })

  it('rejects malformed document ids without calling the backend', async () => {
    await expect($fetch('/api/fediverse/stats/doc%2F..%2Fadmin')).rejects.toMatchObject({ response: { status: 400 } })
    expect(mock.requests.some((request) => request.path.startsWith('/api/fediverse'))).toBe(false)
  })
})

describe('/api/comments', () => {
  const relation = 'api::article.article:doc-vue'

  it('returns approved comments with the fediverse fields and hides pending or rejected ones', async () => {
    const response = await $fetch<{ data: Array<Record<string, unknown>> }>('/api/comments/flat', { query: { relation } })
    const byId = new Map(response.data.map((comment) => [comment.id, comment]))

    expect([...byId.keys()]).toEqual([201, 202, 203, 205])
    expect(byId.get(201)).toMatchObject({
      content: 'Great introduction to composables.',
      isAdminComment: false,
      fediverseActorHandle: null,
      fediverseUri: null,
    })
    expect(byId.get(202)).toMatchObject({
      fediverseActorHandle: '@bea@mastodon.social',
      fediverseUri: 'https://mastodon.social/users/bea/statuses/1',
      author: { name: 'Bea' },
    })
    expect(byId.get(203)).toMatchObject({ isAdminComment: true, threadOf: { id: 202 } })
  })

  it('keeps fediverse content as plain text and drops links that are not http(s)', async () => {
    const response = await $fetch<{ data: Array<Record<string, unknown>> }>('/api/comments/flat', { query: { relation } })
    const unsafe = response.data.find((comment) => comment.id === 205)
    expect(unsafe).toMatchObject({ content: '<script>alert(1)</script>', fediverseActorHandle: '@eve@evil.example', fediverseUri: null })
  })

  it('never exposes the commenter email', async () => {
    const response = await $fetch<{ data: Array<{ author: Record<string, unknown> }> }>('/api/comments/flat', { query: { relation } })
    expect(response.data.every((comment) => !('email' in comment.author))).toBe(true)
  })

  it('prunes hidden comments from the hierarchy, children included', async () => {
    const response = await $fetch<Array<{ id: number; children?: Array<{ id: number }> }>>('/api/comments', { query: { relation } })
    expect(response.map((comment) => comment.id)).toEqual([201, 202])
    expect(response[1]?.children?.map((child) => child.id)).toEqual([203])
  })

  it('returns the posted blog comment without fediverse fields or email', async () => {
    const response = await $fetch<Record<string, unknown>>('/api/comments', {
      method: 'POST',
      query: { relation },
      body: { author: { id: 'guest-9', name: 'Dani', email: 'dani@example.com' }, content: 'Nice post.' },
    })
    expect(response).toMatchObject({
      content: 'Nice post.',
      author: { id: 'guest-9', name: 'Dani' },
      fediverseActorHandle: null,
      fediverseUri: null,
    })
    expect(response.author).not.toHaveProperty('email')
  })

  it('requires the relation parameter', async () => {
    await expect($fetch('/api/comments/flat')).rejects.toMatchObject({ response: { status: 400 } })
  })
})

describe('/api/newsletter/subscribe', () => {
  it('returns 400 when email is missing', async () => {
    await expect($fetch('/api/newsletter/subscribe', { method: 'POST', body: {} })).rejects.toMatchObject({
      response: { status: 400 },
      data: { statusMessage: 'Email is required' },
    })
  })

  it('returns 400 for an invalid email', async () => {
    await expect(
      $fetch('/api/newsletter/subscribe', { method: 'POST', body: { email: 'not-an-email' } }),
    ).rejects.toMatchObject({ response: { status: 400 } })
  })

  it('returns 409 for an already confirmed subscriber', async () => {
    await expect(
      $fetch('/api/newsletter/subscribe', { method: 'POST', body: { email: 'confirmed@example.com' } }),
    ).rejects.toMatchObject({ response: { status: 409 } })
    const posts = mock.requests.filter(
      (request) => request.method === 'POST' && request.path === '/api/subscribers' && request.body?.data?.email === 'confirmed@example.com',
    )
    expect(posts).toHaveLength(0)
  })

  it('replaces a pending subscriber before creating a new one', async () => {
    await expect(
      $fetch('/api/newsletter/subscribe', { method: 'POST', body: { email: 'pending@example.com' } }),
    ).rejects.toMatchObject({ response: { status: 500 } })
    const deleteRequest = mock.requests.find(
      (request) => request.method === 'DELETE' && request.path === '/api/subscribers/sub-pending',
    )
    expect(deleteRequest).toBeDefined()
    const posts = mock.requests.filter(
      (request) =>
        request.method === 'POST' &&
        request.path === '/api/subscribers' &&
        request.body?.data?.email === 'pending@example.com' &&
        request.body?.data?.confirmed === false,
    )
    expect(posts.length).toBeGreaterThan(0)
  })

  it('returns 500 when SMTP is unreachable but still creates the subscriber in Strapi', async () => {
    await expect(
      $fetch('/api/newsletter/subscribe', { method: 'POST', body: { email: 'new@example.com', locale: 'en' } }),
    ).rejects.toMatchObject({ response: { status: 500 } })
    const posts = mock.requests.filter((request) => request.method === 'POST' && request.path === '/api/subscribers')
    const lastPost = posts[posts.length - 1]
    expect(lastPost?.body?.data).toMatchObject({ email: 'new@example.com', confirmed: false, locale: 'en' })
    expect(lastPost?.body?.data?.confirmationToken).toBeTruthy()
  })
})

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
