import { beforeEach, describe, expect, it } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import type { RawStrapiArticle } from '~/interfaces/strapi-post'
import { Category } from '~/interfaces/design'
import { startMockStrapi } from './mock-strapi'

const mock = await startMockStrapi()
process.env.STRAPI_URL = mock.url
process.env.NUXT_PUBLIC_STRAPI_URL = mock.url
process.env.NUXT_SMTP_PORT = '1'

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
        id: 3,
        title: 'Guía de Vue Composables',
        slug: 'guia-vue-composables',
        description: 'Una guía profunda sobre composables de Vue.',
        publishedAt: '2026-02-02T10:00:00.000Z',
        cover: { url: '/uploads/cover-vue-es.png' },
        category: { name: 'Desarrollo de software', slug: Category.Software },
      },
      {
        id: 1,
        title: 'Understanding Vue Composables',
        slug: 'understanding-vue-composables',
        description: 'A deep dive into writing reusable Vue composables.',
        publishedAt: '2026-02-01T10:00:00.000Z',
        cover: { url: '/uploads/cover-vue.png' },
        category: { name: 'Desarrollo de software', slug: Category.Software },
      },
    ])
  })

  it('searches only the requested locale', async () => {
    const result = await $fetch<Array<{ slug: string }>>('/api/search', { query: { q: 'composables', locale: 'es' } })
    expect(result.map((post) => post.slug)).toEqual(['guia-vue-composables'])
    const strapiRequests = mock.requests.filter((request) => request.method === 'GET' && request.path === '/api/articles')
    expect(strapiRequests[strapiRequests.length - 1].query.locale).toBe('es')
  })

  it('forwards the title filter to Strapi', async () => {
    await $fetch('/api/search', { query: { q: 'composables' } })
    const strapiRequests = mock.requests.filter((request) => request.method === 'GET' && request.path === '/api/articles')
    const lastRequest = strapiRequests[strapiRequests.length - 1]
    expect(lastRequest).toBeDefined()
    expect(getNestedValue(lastRequest.query, ['filters', 'title', '$containsi'])).toBe('composables')
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
