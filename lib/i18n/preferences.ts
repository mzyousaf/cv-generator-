export const LOCALES = ["en", "es", "fr", "de", "pt", "it", "nl", "pl", "tr", "ru", "ar", "zh"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
  it: "Italiano",
  nl: "Nederlands",
  pl: "Polski",
  tr: "Türkçe",
  ru: "Русский",
  ar: "العربية",
  zh: "中文",
};

const RTL_LOCALES: ReadonlySet<Locale> = new Set(["ar"]);

export function localeDirection(locale: Locale): "ltr" | "rtl" {
  return RTL_LOCALES.has(locale) ? "rtl" : "ltr";
}

export const THEMES = ["coral", "violet", "ocean", "emerald", "rose", "sunset"] as const;
export type ThemeId = (typeof THEMES)[number];
export const DEFAULT_THEME: ThemeId = "coral";

/** Swatch colours for the theme picker (matches `--brand-600` per theme). */
export const THEME_SWATCHES: Record<ThemeId, string> = {
  coral: "linear-gradient(135deg, #e11d48, #fb923c)",
  violet: "#6542ec",
  ocean: "oklch(54.6% 0.245 262.881)",
  emerald: "oklch(56% 0.115 184.704)",
  rose: "oklch(58.6% 0.253 17.585)",
  sunset: "oklch(62% 0.21 41.116)",
};

export const COLOR_MODES = ["light", "dark", "system"] as const;
export type ColorMode = (typeof COLOR_MODES)[number];
export const DEFAULT_COLOR_MODE: ColorMode = "system";

export const PREFERENCE_COOKIES = {
  locale: "cvg-locale",
  theme: "cvg-theme",
  mode: "cvg-mode",
} as const;

export type Preferences = {
  locale: Locale;
  theme: ThemeId;
  mode: ColorMode;
};

function pick<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

/** Parse untrusted cookie values into supported preferences. */
export function resolvePreferences(raw: {
  locale?: string;
  theme?: string;
  mode?: string;
}): Preferences {
  return {
    locale: pick(raw.locale, LOCALES, DEFAULT_LOCALE),
    theme: pick(raw.theme, THEMES, DEFAULT_THEME),
    mode: pick(raw.mode, COLOR_MODES, DEFAULT_COLOR_MODE),
  };
}

/** Pick the best supported locale from an Accept-Language header. */
export function localeFromAcceptLanguage(header: string | null | undefined): Locale | undefined {
  if (!header) {
    return undefined;
  }
  for (const part of header.split(",")) {
    const base = part.trim().split(";")[0]?.split("-")[0]?.toLowerCase();
    if (base && (LOCALES as readonly string[]).includes(base)) {
      return base as Locale;
    }
  }
  return undefined;
}
