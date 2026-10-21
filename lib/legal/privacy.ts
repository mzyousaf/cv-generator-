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
export const PRIVACY_POLICY: Record<Locale, LegalDocument> = {
  en: en.privacy,
  es: es.privacy,
  fr: fr.privacy,
  de: de.privacy,
  pt: pt.privacy,
  it: it.privacy,
  nl: nl.privacy,
  pl: pl.privacy,
  tr: tr.privacy,
  ru: ru.privacy,
  ar: ar.privacy,
  zh: zh.privacy,
};
