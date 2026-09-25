import type { SearchPostResult } from '~/interfaces'
import { MIN_SEARCH_LENGTH, isContentSearch } from '~/helpers/search'

const PALETTE_RESULTS = 10

export default defineEventHandler(async (event): Promise<SearchPostResult[]> => {
  const query = getQuery(event)
  const term = typeof query.q === 'string' ? query.q.trim() : ''
  const locale = typeof query.locale === 'string' && query.locale ? query.locale : undefined

  if (term.length < MIN_SEARCH_LENGTH) {
    return []
  }

  setHeader(event, 'Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')

  try {
    return await searchArticles({ query: term, locale, content: isContentSearch(query.content), limit: PALETTE_RESULTS })
  } catch (error: unknown) {
    console.error('Search error:', asUpstreamError(error).data || error)
    return []
  }
})
