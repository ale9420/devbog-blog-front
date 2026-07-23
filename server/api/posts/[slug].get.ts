import qs from 'qs';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const query = getQuery(event)
  const config = useRuntimeConfig()
  const locale = query.locale as string | undefined

  if (!slug) {
    throw createError({ statusCode: 400, message: 'Slug is required' })
  }

  const params = qs.stringify({
    filters: { slug: { $eq: slug } },
    locale,
    populate: {
      cover: { populate: '*' },
      category: { populate: '*' },
      author: { populate: '*' },
      seo: { populate: '*' },
      blocks: {
        on: {
          'shared.rich-text': { populate: '*' },
          'shared.quote': { populate: '*' },
          'shared.media': { populate: '*' },
          'shared.slider': { populate: '*' },
        },
      },
    },
  }, { skipNulls: true })

  const headers: Record<string, string> = {}
  if (config.strapiApiToken) {
    headers['Authorization'] = `Bearer ${config.strapiApiToken}`
  }

  setHeader(event, 'Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
  setHeader(event, 'CDN-Cache-Control', 'public, s-maxage=300')
  setHeader(event, 'Vercel-CDN-Cache-Control', 'public, s-maxage=300')

  const response = await $fetch(`${config.public.strapiUrl}/api/articles?${params}`, { headers })

  const data = (response as any).data
  if (!data || data.length === 0) {
    throw createError({ statusCode: 404, message: 'Post not found' })
  }

  return data[0]
})
