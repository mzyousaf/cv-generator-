import assert from "node:assert/strict";
import test from "node:test";
import {
  localeDirection,
  localeFromAcceptLanguage,
  resolvePreferences,
} from "./preferences";

test("resolvePreferences falls back to defaults for unknown values", () => {
  assert.deepEqual(resolvePreferences({ locale: "xx", theme: "neon", mode: "dim" }), {
    locale: "en",
    theme: "coral",
    mode: "system",
  });
});

test("resolvePreferences keeps supported values", () => {
  // Renamed themes map to their replacements.
  assert.equal(resolvePreferences({ theme: "rose" }).theme, "fuchsia");
  assert.equal(resolvePreferences({ theme: "sunset" }).theme, "graphite");
  assert.deepEqual(resolvePreferences({ locale: "ar", theme: "fuchsia", mode: "dark" }), {
    locale: "ar",
    theme: "fuchsia",
    mode: "dark",
  });
});

test("localeFromAcceptLanguage picks the first supported base language", () => {
  assert.equal(localeFromAcceptLanguage("ja-JP,de-DE;q=0.8,en;q=0.5"), "de");
  assert.equal(localeFromAcceptLanguage("zh-CN"), "zh");
  assert.equal(localeFromAcceptLanguage("pt-BR"), "pt");
  assert.equal(localeFromAcceptLanguage("tr-TR,en;q=0.5"), "tr");
  assert.equal(localeFromAcceptLanguage("ja-JP"), undefined);
  assert.equal(localeFromAcceptLanguage(null), undefined);
});

test("Arabic renders right-to-left", () => {
  assert.equal(localeDirection("ar"), "rtl");
  assert.equal(localeDirection("fr"), "ltr");
});
