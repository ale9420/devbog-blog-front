import type { LocationQuery } from 'vue-router'

const PER_LOCALE_PARAMS = new Set<string>(['page'])

export function localeSwitchQuery(query: LocationQuery): LocationQuery {
  return Object.fromEntries(Object.entries(query).filter(([key]) => !PER_LOCALE_PARAMS.has(key)))
}
