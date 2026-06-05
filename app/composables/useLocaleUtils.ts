import { Locale } from "~/interfaces";
import { defaultLocale } from "~/interfaces";

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

  function switchLocale(newLocale: string | Locale): string {
    const currentPath = route.path;
    const currentLocale = locale.value as string;

    const pathWithoutLocale = currentLocale === defaultLocale
      ? currentPath.replace(/^\/(en|es)/, "") || "/"
      : currentPath.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, "") || "/";

    if (newLocale === defaultLocale) {
      return pathWithoutLocale === "/" ? "/" : pathWithoutLocale;
    }
    return `/${newLocale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;
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
