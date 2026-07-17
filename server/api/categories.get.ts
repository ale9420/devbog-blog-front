import qs from 'qs'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()
  const locale = query.locale as string | undefined

  const params = qs.stringify({
    fields: ['id'],
    populate: {
      category: { fields: ['id', 'name'] },
    },
    pagination: { pageSize: 200 },
    locale,
  }, { skipNulls: true })

  const headers: Record<string, string> = {}
  if (config.strapiApiToken) {
    headers['Authorization'] = `Bearer ${config.strapiApiToken}`
  }

  setHeader(event, 'Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200')

  const response = await $fetch<{ data: any[] }>(
    `${config.public.strapiUrl}/api/articles?${params}`,
    { headers },
  )

  const catMap = new Map<number, { id: number; name: string; count: number }>()

  for (const article of response.data) {
    const cat = article.category
    if (!cat) continue
    const existing = catMap.get(cat.id)
    if (existing) {
      existing.count++
    } else {
      catMap.set(cat.id, { id: cat.id, name: cat.name, count: 1 })
    }
  }

  return Array.from(catMap.values()).sort((a, b) => b.count - a.count)
})
