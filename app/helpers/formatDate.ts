/**
 * Formatting presets for display dates.
 * - `full` (default): "May 27, 2026" (long month, numeric day, numeric year)
 * - `short`: "May 27, 2026" (abbreviated month, numeric day, numeric year)
 * - `abbreviated`: "May 27" (abbreviated month, numeric day, no year)
 */
export type DateFormatStyle = 'full' | 'short' | 'abbreviated'

/**
 * Formats an ISO date string for user-facing display.
 * Returns empty string for falsy/undefined input.
 */
export function formatDate(date: string | undefined, style: DateFormatStyle = 'full'): string {
  if (!date) return ''

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    ...(style === 'full' ? { month: 'long', year: 'numeric' }
      : style === 'short' ? { month: 'short', year: 'numeric' }
      : { month: 'short' }),
  }

  return new Date(date).toLocaleDateString('en-US', options)
}
