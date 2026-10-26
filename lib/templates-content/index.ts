import type { Locale } from "@/lib/i18n/preferences";
import type { TemplatesContent } from "@/lib/templates-content/types";
import { ar } from "@/lib/templates-content/ar";
import { de } from "@/lib/templates-content/de";
import { en } from "@/lib/templates-content/en";
import { es } from "@/lib/templates-content/es";
import { fr } from "@/lib/templates-content/fr";
import { it } from "@/lib/templates-content/it";
import { nl } from "@/lib/templates-content/nl";
import { pl } from "@/lib/templates-content/pl";
import { pt } from "@/lib/templates-content/pt";
import { ru } from "@/lib/templates-content/ru";
import { tr } from "@/lib/templates-content/tr";
import { zh } from "@/lib/templates-content/zh";

/** Long-form template page copy per language (server-only; kept out of the client dictionaries). */
export const TEMPLATES_CONTENT: Record<Locale, TemplatesContent> = { en, es, fr, de, pt, it, nl, pl, tr, ru, ar, zh };

export type { RegionGuide, TemplatesContent } from "@/lib/templates-content/types";
