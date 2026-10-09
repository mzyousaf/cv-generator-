import path from "node:path";
import { Font } from "@react-pdf/renderer";
import type { Locale } from "@/lib/i18n/preferences";

const FONT_DIR = path.join(process.cwd(), "lib", "pdf", "fonts");

const FAMILIES = {
  NotoSans: "NotoSans",
  NotoSerif: "NotoSerif",
  Arabic: "IBMPlexSansArabic",
  Chinese: "NotoSansSC",
} as const;

const CJK = /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff\uff00-\uffef]/;
/** One character plus any closing punctuation that must not start a line. */
const CJK_UNIT = /.[，。、；：！？）」』】》〉”’,.;:!?)%]*/gu;

/**
 * Register bundled TTF fonts once per server process. The check reads
 * react-pdf's own (singleton) store rather than a module flag: a module
 * re-evaluated by hot reload would otherwise register every face again,
 * and duplicate faces garble glyph mappings in later documents.
 */
export function registerPdfFonts(): void {
  // Keep words intact; CV text should never be hyphenated mid-word. CJK
  // text has no spaces, so allow a break after every character there, except
  // before closing punctuation (。，、…). The empty parts stop react-pdf
  // inserting a hyphen at the break.
  Font.registerHyphenationCallback((word) =>
    CJK.test(word) ? (word.match(CJK_UNIT) ?? [word]).flatMap((unit) => [unit, ""]) : [word],
  );
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
        { src: file(italic), fontStyle: "italic", fontWeight: 700 },
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
