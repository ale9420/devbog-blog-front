import type { LocationQuery } from 'vue-router'

export enum Locale {
  English = "en",
  SpanishColombia = "es",
}

export type LocaleCode = Locale | string;

export const defaultLocale = Locale.English;

export interface LocaleSwitchTarget {
  path: string
  query: LocationQuery
  hash: string
}
