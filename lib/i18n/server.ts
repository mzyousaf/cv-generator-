import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ROUTE_LOCALE_HEADER } from "@/lib/i18n/routing";
import {
  localeFromAcceptLanguage,
  PREFERENCE_COOKIES,
  LOCALES,
  resolvePreferences,
  type Locale,
  type Preferences,
} from "@/lib/i18n/preferences";

/**
 * Locale, theme and colour mode for this request. A language-prefixed URL
 * (/de/…) decides the locale; otherwise the cookie, then Accept-Language.
 */
export const getPreferences = cache(async (): Promise<Preferences> => {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  return resolvePreferences({
    locale:
      headerStore.get(ROUTE_LOCALE_HEADER) ??
      cookieStore.get(PREFERENCE_COOKIES.locale)?.value ??
      localeFromAcceptLanguage(headerStore.get("accept-language")),
    theme: cookieStore.get(PREFERENCE_COOKIES.theme)?.value,
    mode: cookieStore.get(PREFERENCE_COOKIES.mode)?.value,
  });
});

export async function getServerDictionary() {
  const { locale } = await getPreferences();
  return getDictionary(locale);
}

/** The locale fixed by a language-prefixed URL, or null on an unprefixed URL. */
export const getRouteLocale = cache(async (): Promise<Locale | null> => {
  const value = (await headers()).get(ROUTE_LOCALE_HEADER);
  return value && (LOCALES as readonly string[]).includes(value) ? (value as Locale) : null;
});
