import type { Locale } from "@/lib/i18n/preferences";
import { ar } from "./ar";
import { de } from "./de";
import { en, type Dictionary } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { zh } from "./zh";

const dictionaries: Record<Locale, Dictionary> = { en, es, fr, de, ar, zh };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? en;
}
