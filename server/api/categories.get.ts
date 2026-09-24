import qs from 'qs'
import type { CategoryCount } from '~/interfaces'
import { categoryOrder, isCategory } from '~/helpers/categories'

export default defineEventHandler(async (event): Promise<CategoryCount[]> => {
  const query = getQuery(event)
  const config = useRuntimeConfig()
  const locale = (query.locale as string | undefined) || 'en'

  const params = qs.stringify({
    pagination: { pageSize: 100 },
    fields: ['name', 'slug'],
    populate: {
      articles: {
        fields: ['id'],
        filters: { locale: { $eq: locale } },
      },
    },
  })

  const headers: Record<string, string> = {}
  if (config.strapiApiToken) {
    headers['Authorization'] = `Bearer ${config.strapiApiToken}`
  }

  setHeader(event, 'Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200')

  const response = await $fetch<{
    data: Array<{
      id: number
      name: string
      slug?: string | null
      articles?: Array<{ id: number }>
    }>
  }>(`${config.public.strapiUrl}/api/categories?${params}`, { headers })

  return response.data
    .map((category) => ({
      id: category.id,
      slug: category.slug ?? null,
      name: category.name,
      count: category.articles?.length || 0,
    }))
    .filter((category) => isCategory(category.slug) || category.count > 0)
    .sort((a, b) => categoryOrder(a.slug) - categoryOrder(b.slug) || b.count - a.count)
})
