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
          'about.profile': { populate: '*' },
          'about.statement': { populate: '*' },
          'about.topics': { populate: '*' },
          'about.projects': { populate: { projects: { populate: '*' } } },
          'about.principles': { populate: '*' },
          'about.open-source': { populate: '*' },
          'about.contact': { populate: '*' },
          'shared.rich-text': { populate: '*' },
          'shared.quote': { populate: '*' },
          'shared.media': { populate: '*' },
          'shared.slider': { populate: '*' },
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

  let response: { data?: unknown }
  try {
    response = await $fetch<{ data?: unknown }, string>(`${config.public.strapiUrl}/api/about?${params}`, { headers })
  } catch (error: unknown) {
    console.error('Strapi fetch about error:', asUpstreamError(error).data || error)
    throw createError({
      statusCode: 502,
      message: upstreamErrorMessage(error, 'Failed to fetch about page'),
    })
  }

  const data: unknown = response.data
  if (!data) {
    throw createError({ statusCode: 404, message: 'About page not found' })
  }

  return data
})
