import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n/preferences";

/**
 * Language-prefixed URLs for public pages: English lives at the root
 * (/templates), every other language under its code (/de/templates). Each
 * language version is then its own indexable URL with hreflang alternates.
 */
export const PREFIXED_LOCALES = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);

/** Request header the proxy sets on a rewritten, language-prefixed request. */
export const ROUTE_LOCALE_HEADER = "x-cvg-route-locale";

/** Public routes that have language versions (the dashboard does not). */
const LOCALIZED_ROUTE = /^\/(?:$|templates(?:\/.*)?$|privacy$|terms$|signup$|login$)/;

export function isLocalizedRoute(path: string): boolean {
  return LOCALIZED_ROUTE.test(path);
}

/** "/de/templates" → { locale: "de", path: "/templates" }; unprefixed → locale null. */
export function splitLocalePrefix(pathname: string): { locale: Locale | null; path: string } {
  const match = /^\/([a-z]{2})(\/.*)?$/.exec(pathname);
  if (match && (PREFIXED_LOCALES as string[]).includes(match[1])) {
    return { locale: match[1] as Locale, path: match[2] || "/" };
  }
  return { locale: null, path: pathname };
}

/** The URL of `path` in `locale` (English stays unprefixed). */
export function localizePath(path: string, locale: Locale): string {
  const [, base, suffix] = /^([^?#]*)(.*)$/.exec(path) ?? [path, path, ""];
  if (locale === DEFAULT_LOCALE || !isLocalizedRoute(base)) {
    return path;
  }
  return `${base === "/" ? `/${locale}` : `/${locale}${base}`}${suffix}`;
}

/** hreflang map for a localized route: every language plus x-default. */
export function languageAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(LOCALES.map((locale) => [locale, localizePath(path, locale)])),
    "x-default": path,
  };
}
