import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  localeFromAcceptLanguage,
  PREFERENCE_COOKIES,
  resolvePreferences,
  type Preferences,
} from "@/lib/i18n/preferences";

/** Locale, theme and colour mode for this request (cookies, then Accept-Language). */
export const getPreferences = cache(async (): Promise<Preferences> => {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  return resolvePreferences({
    locale:
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
