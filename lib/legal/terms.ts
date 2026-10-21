import type { Locale } from "@/lib/i18n/preferences";
import type { LegalDocument } from "@/lib/legal/types";
import * as en from "@/lib/legal/content/en";
import * as es from "@/lib/legal/content/es";
import * as fr from "@/lib/legal/content/fr";
import * as de from "@/lib/legal/content/de";
import * as pt from "@/lib/legal/content/pt";
import * as it from "@/lib/legal/content/it";
import * as nl from "@/lib/legal/content/nl";
import * as pl from "@/lib/legal/content/pl";
import * as tr from "@/lib/legal/content/tr";
import * as ru from "@/lib/legal/content/ru";
import * as ar from "@/lib/legal/content/ar";
import * as zh from "@/lib/legal/content/zh";

/** `{name}` is replaced with the product name when rendered. */
export const TERMS_AND_CONDITIONS: Record<Locale, LegalDocument> = {
  en: en.terms,
  es: es.terms,
  fr: fr.terms,
  de: de.terms,
  pt: pt.terms,
  it: it.terms,
  nl: nl.terms,
  pl: pl.terms,
  tr: tr.terms,
  ru: ru.terms,
  ar: ar.terms,
  zh: zh.terms,
};
