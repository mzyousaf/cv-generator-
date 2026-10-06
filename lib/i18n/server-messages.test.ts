import assert from "node:assert/strict";
import test from "node:test";
import { AI_ERROR_MESSAGES, AI_FAILURE_MESSAGES } from "@/lib/ai/errors";
import { CV_ERROR_MESSAGES } from "@/lib/cv/errors";
import { PDF_ERROR_MESSAGES } from "@/lib/pdf/errors";
import { RESUME_IMPORT_ERROR_MESSAGES } from "@/lib/resume-import/errors";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizeServerMessage, serverErrorKey } from "@/lib/i18n/server-messages";

test("every coded server message has a translation key", () => {
  const all = [
    ...Object.values(CV_ERROR_MESSAGES),
    ...Object.values(AI_ERROR_MESSAGES),
    ...Object.values(AI_FAILURE_MESSAGES),
    ...Object.values(PDF_ERROR_MESSAGES),
    ...Object.values(RESUME_IMPORT_ERROR_MESSAGES),
  ];
  const missing = all.filter((message) => !serverErrorKey(message));
  assert.deepEqual(missing, []);
});

test("field-based validation messages are translated", () => {
  const fr = getDictionary("fr");
  assert.equal(localizeServerMessage(fr, "skills must be an array."), fr.serverErrors.sectionInvalid);
  assert.equal(localizeServerMessage(fr, "languages has too many entries."), fr.serverErrors.sectionTooMany);
});

test("known messages translate and unknown ones pass through", () => {
  const de = getDictionary("de");
  assert.equal(localizeServerMessage(de, "CV not found."), "Lebenslauf nicht gefunden.");
  assert.equal(localizeServerMessage(de, "Something unexpected"), "Something unexpected");
  assert.equal(localizeServerMessage(de, undefined), "");
});
