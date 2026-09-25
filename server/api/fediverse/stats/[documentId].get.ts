import type { FediverseStats } from '~/interfaces'

const DOCUMENT_ID = /^[\w-]+$/
const UPSTREAM_TIMEOUT_MS = 3000

function toCount(value: unknown): number {
  const count = Number(value)
  return Number.isInteger(count) && count > 0 ? count : 0
}

export default defineEventHandler(async (event): Promise<FediverseStats> => {
  const documentId = getRouterParam(event, 'documentId') ?? ''
  const config = useRuntimeConfig()

  if (!DOCUMENT_ID.test(documentId)) {
    throw createError({ statusCode: 400, message: 'Invalid document id' })
  }

  let response: Partial<Record<keyof FediverseStats, unknown>>
  try {
    response = await $fetch<Partial<Record<keyof FediverseStats, unknown>>>(
      `${config.public.strapiUrl}/api/fediverse/articles/${documentId}/stats`,
      { timeout: UPSTREAM_TIMEOUT_MS },
    )
  } catch (error: unknown) {
    const status = asUpstreamError(error).response?.status
    if (status === 404) {
      throw createError({ statusCode: 404, message: 'Article not federated' })
    }
    console.error('Strapi fetch fediverse stats error:', asUpstreamError(error).data || error)
    throw createError({
      statusCode: 502,
      message: upstreamErrorMessage(error, 'Failed to fetch fediverse stats'),
    })
  }

  setHeader(event, 'Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')

  return { likes: toCount(response?.likes), boosts: toCount(response?.boosts) }
})
