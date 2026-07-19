import qs from 'qs';

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()
  const locale = query.locale as string | undefined

  const params = qs.stringify({
    locale,
    populate: {
      blocks: {
        on: {
          'shared.hero': { populate: '*' },
          'shared.rich-text': { populate: '*' },
          'shared.quote': { populate: '*' },
          'shared.media': { populate: '*' },
          'shared.slider': { populate: '*' },
          'shared.topic-card': { populate: '*' },
          'shared.social-links': { populate: '*' },
          'shared.tech-stack': { populate: '*' },
        },
      },
      seo: { populate: '*' },
    },
  }, { skipNulls: true })

  const headers: Record<string, string> = {}
  if (config.strapiApiToken) {
    headers['Authorization'] = `Bearer ${config.strapiApiToken}`
  }

  setHeader(event, 'Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
  setHeader(event, 'CDN-Cache-Control', 'public, s-maxage=300')
  setHeader(event, 'Vercel-CDN-Cache-Control', 'public, s-maxage=300')

  const response = await $fetch<{ data?: unknown }, string>(`${config.public.strapiUrl}/api/about?${params}`, { headers })

  const data: unknown = response.data
  if (!data) {
    throw createError({ statusCode: 404, message: 'About page not found' })
  }

  return data
})
