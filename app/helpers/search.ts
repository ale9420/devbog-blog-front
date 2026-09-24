export const MIN_SEARCH_LENGTH = 3

export function normalizeText(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

export function matchesQuery(label: string, query: string): boolean {
  const needle = normalizeText(query)
  return needle === '' || normalizeText(label).includes(needle)
}

export function cycleIndex(current: number, total: number, delta: number): number {
  if (total === 0) return -1
  if (current < 0) return delta > 0 ? 0 : total - 1
  return (current + delta + total) % total
}

export function padCount(count: number): string {
  return String(count).padStart(2, '0')
}
