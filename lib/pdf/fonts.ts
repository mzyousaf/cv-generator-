import path from "node:path";
import { Font } from "@react-pdf/renderer";
import type { Locale } from "@/lib/i18n/preferences";
import { breakWord } from "@/lib/pdf/text-shaping";

const FONT_DIR = path.join(process.cwd(), "lib", "pdf", "fonts");

const FAMILIES = {
  NotoSans: "NotoSans",
  NotoSerif: "NotoSerif",
  Arabic: "IBMPlexSansArabic",
  Chinese: "NotoSansSC",
} as const;


/**
 * Register bundled TTF fonts once per server process. The check reads
 * react-pdf's own (singleton) store rather than a module flag: a module
 * re-evaluated by hot reload would otherwise register every face again,
 * and duplicate faces garble glyph mappings in later documents.
 */
export function registerPdfFonts(): void {
  // Words are never hyphenated; CJK text may break between characters.
  Font.registerHyphenationCallback(breakWord);
  if (Font.getRegisteredFontFamilies().includes(FAMILIES.NotoSans)) {
    return;
  }
  const file = (name: string) => path.join(FONT_DIR, `${name}.ttf`);
  /** Scripts without italics reuse the upright face for italic requests. */
  const family = (name: string, base: string, italic = `${base}-Regular`) =>
    Font.register({
      family: name,
      fonts: [
        { src: file(`${base}-Regular`) },
        { src: file(`${base}-Bold`), fontWeight: 700 },
        { src: file(italic), fontStyle: "italic" },
      ],
    });
  family(FAMILIES.NotoSans, "NotoSans", "NotoSans-Italic");
  family(FAMILIES.NotoSerif, "NotoSerif", "NotoSerif-Italic");
  family(FAMILIES.Arabic, "IBMPlexSansArabic");
  family(FAMILIES.Chinese, "NotoSansSC");
}

/**
 * Font stack for a CV document. The primary face matches the document
 * language; the others are fallbacks for names or terms in other scripts.
 */
export function pdfFontFamily(locale: Locale, style: "sans" | "serif" = "sans"): string[] {
  const latin = style === "serif" ? FAMILIES.NotoSerif : FAMILIES.NotoSans;
  switch (locale) {
    case "ar":
      return [FAMILIES.Arabic, latin, FAMILIES.Chinese];
    case "zh":
      return [FAMILIES.Chinese, latin, FAMILIES.Arabic];
    default:
      return [latin, FAMILIES.Arabic, FAMILIES.Chinese];
  }
}
