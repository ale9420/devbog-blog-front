import { defaultLocale, type Locale, type LocaleSwitchTarget } from "~/interfaces";
import { localeSwitchQuery } from "~/helpers/locale";

export function useLocaleUtils() {
  const { locale, locales } = useI18n();
  const route = useRoute();

  function getLocalePrefix(localeCode?: string | Locale): string {
    const l = localeCode || locale.value;
    if (l === defaultLocale) return "";
    return `/${l}`;
  }

  function localizePath(path: string, localeCode?: string | Locale): string {
    const prefix = getLocalePrefix(localeCode);
    if (!path || path === "/") {
      return prefix || "/";
    }
    return `${prefix}${path.startsWith("/") ? path : `/${path}`}`;
  }

  function getLocalizedPaths(basePath: string): Record<string, string> {
    const allLocales = (locales.value as Array<{ code: string }>).map(
      (l) => l.code,
    );
    const paths: Record<string, string> = {};

    for (const l of allLocales) {
      paths[l] = localizePath(basePath, l);
    }

    return paths;
  }

  function switchLocale(newLocale: string | Locale): LocaleSwitchTarget {
    const currentPath = route.path;
    const currentLocale = locale.value as string;

    const pathWithoutLocale = currentLocale === defaultLocale
      ? currentPath.replace(/^\/(en|es)/, "") || "/"
      : currentPath.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, "") || "/";

    const path = newLocale === defaultLocale
      ? pathWithoutLocale
      : `/${newLocale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;

    return { path, query: localeSwitchQuery(route.query), hash: route.hash };
  }

  const isDefaultLocale = computed(() => locale.value === defaultLocale);

  const currentLocalePath = computed(() => localizePath("/"));

  return {
    getLocalePrefix,
    localizePath,
    getLocalizedPaths,
    switchLocale,
    isDefaultLocale,
    currentLocalePath,
  };
}
