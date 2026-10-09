import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { breakWord, upperCase } from "@/lib/pdf/text-shaping";

const units = (word: string) => breakWord(word).filter(Boolean);

describe("PDF text shaping", () => {
  it("upper-cases with the document language", () => {
    assert.equal(upperCase("Eğitim ve diller", "tr"), "EĞİTİM VE DİLLER");
    assert.equal(upperCase("Education", "en"), "EDUCATION");
  });

  it("keeps brand names intact", () => {
    assert.equal(upperCase("LinkedIn profili", "tr"), "LINKEDIN PROFİLİ");
    assert.equal(upperCase("linkedin", "tr"), "LINKEDIN");
  });

  it("never hyphenates non-CJK words", () => {
    assert.deepEqual(breakWord("Development"), ["Development"]);
  });

  it("breaks CJK text between characters, keeping punctuation and Latin runs together", () => {
    assert.deepEqual(units("经验，善于"), ["经", "验，", "善", "于"]);
    assert.deepEqual(units("负责React开发2024年"), ["负", "责", "React", "开", "发", "2024", "年"]);
    assert.deepEqual(units("（上海）"), ["（上", "海）"]);
    assert.deepEqual(units("成果。"), ["成", "果。"]);
  });
});
