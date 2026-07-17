import qs from 'qs';

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()
  const page = query.page ? Number(query.page) : 1
  const pageSize = query.pageSize ? Number(query.pageSize) : 10
  const locale = query.locale as string | undefined

  const params = qs.stringify({
    pagination: { page, pageSize },
    populate: {
      cover: { populate: '*' },
      category: { populate: '*' },
      author: { populate: '*' },
    },
    sort: 'publishedAt:desc',
    locale,
  }, { skipNulls: true })

  const headers: Record<string, string> = {}
  if (config.strapiApiToken) {
    headers['Authorization'] = `Bearer ${config.strapiApiToken}`
  }

  setHeader(event, 'Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
  setHeader(event, 'CDN-Cache-Control', 'public, s-maxage=300')
  setHeader(event, 'Vercel-CDN-Cache-Control', 'public, s-maxage=300')

  const response = await $fetch(`${config.public.strapiUrl}/api/articles?${params}`, { headers })

  return response
})
