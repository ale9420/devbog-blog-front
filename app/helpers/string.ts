/**
 * Extracts the first character of a name, uppercased.
 * Returns `fallback` (default `"?"`) when name is undefined or empty.
 * Used for avatar placeholders throughout the app.
 */
export function getInitial(name: string | undefined, fallback = '?'): string {
  if (!name) return fallback
  return name.charAt(0).toUpperCase()
}
