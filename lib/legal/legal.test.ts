import assert from "node:assert/strict";
import test from "node:test";
import { LOCALES } from "@/lib/i18n/preferences";
import { PRIVACY_POLICY } from "@/lib/legal/privacy";
import { TERMS_AND_CONDITIONS } from "@/lib/legal/terms";
import type { LegalDocument } from "@/lib/legal/types";

function shape(doc: LegalDocument): string[] {
  return doc.blocks.map((block) =>
    "ul" in block ? `ul:${block.ul.length}` : "h" in block ? "h" : "p",
  );
}

for (const [name, docs] of [
  ["privacy", PRIVACY_POLICY],
  ["terms", TERMS_AND_CONDITIONS],
] as const) {
  for (const locale of LOCALES) {
    test(`${name} (${locale}) mirrors the English structure`, () => {
      assert.deepEqual(shape(docs[locale]), shape(docs.en));
      assert.ok(docs[locale].title.trim());
    });
  }
}
