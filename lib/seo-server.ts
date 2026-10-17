import "server-only";
import type { Metadata } from "next";
import { languageAlternates, localizePath } from "@/lib/i18n/routing";
import { siteConfig } from "@/lib/constants";
import { getPreferences, getRouteLocale } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/preferences";

/**
 * Canonical + hreflang for a localized public route. The canonical is the
 * URL actually requested (/de/templates or /templates), and every language
 * version is listed as an alternate.
 */
export async function pageAlternates(path: string): Promise<NonNullable<Metadata["alternates"]>> {
  const routeLocale = await getRouteLocale();
  return {
    canonical: routeLocale ? localizePath(path, routeLocale) : path,
    languages: languageAlternates(path),
  };
}

/** Localize a path for links rendered on the server (keeps /de/ on /de/ pages). */
export async function routePath(path: string): Promise<string> {
  const routeLocale = await getRouteLocale();
  return routeLocale ? localizePath(path, routeLocale) : path;
}

/** A synchronous localizer for the current request, for building many paths. */
export async function localizer(): Promise<(path: string) => string> {
  const routeLocale = await getRouteLocale();
  return (path) => (routeLocale ? localizePath(path, routeLocale) : path);
}

/** Open Graph locale per UI language. */
export const OG_LOCALE: Record<Locale, string> = {
  en: "en_GB",
  es: "es_ES",
  fr: "fr_FR",
  de: "de_DE",
  pt: "pt_BR",
  it: "it_IT",
  nl: "nl_NL",
  pl: "pl_PL",
  tr: "tr_TR",
  ru: "ru_RU",
  ar: "ar_AR",
  zh: "zh_CN",
};

const SOCIAL_IMAGE = { url: "/opengraph-image.png", width: 1200, height: 630, alt: `${siteConfig.name}: free AI CV builder` };

/**
 * Complete metadata for a public page. Next replaces (not merges) a parent's
 * openGraph/twitter objects, so every page must carry the full set: its own
 * URL, title, description, locale and the social image.
 */
export async function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
}): Promise<Metadata> {
  const [{ locale }, alternates, url] = await Promise.all([getPreferences(), pageAlternates(path), routePath(path)]);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates,
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: OG_LOCALE[locale],
      url,
      title,
      description,
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SOCIAL_IMAGE.url],
    },
  };
}
