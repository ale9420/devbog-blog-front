import qs from 'qs';
import type { CommentsResponse } from '~/interfaces/comment'
import { toPublicComments } from '~/helpers/comments'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const relation = commentRelation(event)

  const locale = commentLocale(query.locale)

  const params = qs.stringify({
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
    },
    sort: query.sort,
    locale,
  }, { skipNulls: true })

  const url = `/api/comments/${relation}/flat${params ? '?' + params : ''}`

  try {
    const response = await strapiFetch<CommentsResponse>(url)
    return { ...response, data: toPublicComments(response?.data ?? []) }
  } catch (error: unknown) {
    console.error('Strapi fetch comments (flat) error:', asUpstreamError(error).data || error)
    throw createError({
      statusCode: asUpstreamError(error).response?.status || 500,
      message: upstreamErrorMessage(error, 'Failed to fetch comments'),
    })
  }
})
