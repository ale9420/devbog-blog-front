export const MAX_PAGE_SIZE = 50

export interface Pagination {
  page: number
  pageSize: number
}

function positiveInteger(value: unknown, fallback: number): number | null {
  if (value === undefined || value === null || value === '') return fallback
  const number = typeof value === 'string' && /^\d+$/.test(value.trim()) ? Number(value) : value
  return Number.isSafeInteger(number) && (number as number) >= 1 ? number as number : null
}

export function parsePagination(query: { page?: unknown, pageSize?: unknown }, defaultPageSize: number): Pagination | null {
  const page = positiveInteger(query.page, 1)
  const pageSize = positiveInteger(query.pageSize, defaultPageSize)
  if (page === null || pageSize === null) return null
  return { page, pageSize: Math.min(pageSize, MAX_PAGE_SIZE) }
}
