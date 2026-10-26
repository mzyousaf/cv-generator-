import assert from "node:assert/strict";
import test from "node:test";
import { TEMPLATE_REGIONS, TEMPLATE_STYLES } from "@/lib/cv/template-catalog";
import { LOCALES } from "@/lib/i18n/preferences";
import { TEMPLATES_CONTENT } from "@/lib/templates-content";

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

for (const locale of LOCALES) {
  const content = TEMPLATES_CONTENT[locale];

  test(`templates content (${locale}) covers every region and style`, () => {
    for (const region of TEMPLATE_REGIONS) {
      for (const text of Object.values(content.regions[region])) {
        assert.ok(text.trim().length > 3, `${locale} ${region}`);
      }
    }
    for (const style of TEMPLATE_STYLES) {
      assert.ok(content.styles[style].trim().length > 3, `${locale} ${style}`);
    }
  });

  test(`templates content (${locale}) only uses known placeholders`, () => {
    for (const text of strings(content)) {
      for (const [placeholder] of text.matchAll(/\{[^}]*\}/g)) {
        assert.ok(["{name}", "{region}", "{count}"].includes(placeholder), `${locale}: ${placeholder} in "${text}"`);
      }
    }
  });
}
