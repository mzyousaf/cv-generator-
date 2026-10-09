/**
 * Text shaping helpers for PDF export, kept free of react-pdf so they can be
 * unit-tested directly.
 */

/** Brand names keep their own spelling: Turkish rules would give "LİNKEDIN". */
const BRANDS = /\bLinkedIn\b/gi;

/**
 * Upper-case with the document language's rules (Turkish i → İ, not I).
 * react-pdf's own `textTransform: "uppercase"` uses the locale-blind
 * String#toUpperCase.
 */
export function upperCase(text: string, language: string): string {
  return text
    .split(BRANDS)
    .map((part) => part.toLocaleUpperCase(language))
    .join("LINKEDIN");
}

const CJK_CHAR = "\\u3040-\\u30ff\\u3400-\\u9fff\\uf900-\\ufaff";
const CJK = new RegExp(`[${CJK_CHAR}\\uff00-\\uffef]`);
const OPENING = "（「『【《〈“‘(";
const CLOSING = "，。、；：！？）」』】》〉”’,.;:!?)%";

/**
 * Line-break units for text containing CJK characters: one CJK character, or
 * a run of other characters (Latin words, numbers), each with any opening
 * punctuation before it and closing punctuation after it attached, so a line
 * never starts with "。" or ends with "（", and "React" or "2024" stay whole.
 */
const CJK_UNIT = new RegExp(
  `[${OPENING}]*(?:[${CJK_CHAR}]|[^${CJK_CHAR}${OPENING}${CLOSING}]+)[${CLOSING}]*`,
  "gu",
);

/**
 * Hyphenation callback for react-pdf. Words are never hyphenated; CJK text,
 * which has no spaces, may break between units. The empty parts stop
 * react-pdf from inserting a hyphen at those breaks.
 */
export function breakWord(word: string): string[] {
  if (!CJK.test(word)) {
    return [word];
  }
  return (word.match(CJK_UNIT) ?? [word]).flatMap((unit) => [unit, ""]);
}
