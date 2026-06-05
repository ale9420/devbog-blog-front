export enum Locale {
  English = "en",
  SpanishColombia = "es",
}

export type LocaleCode = Locale | string;

export const defaultLocale = Locale.English;
