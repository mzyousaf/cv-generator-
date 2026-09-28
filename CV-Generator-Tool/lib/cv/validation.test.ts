import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createEmptyCvContent,
  sanitizeCvContent,
  validateCreateCvInput,
  validateUpdateCvInput,
} from "@/lib/cv/validation";

describe("CV validation", () => {
  it("applies defaults on create", () => {
    const result = validateCreateCvInput({});
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.value.title, "Untitled CV");
      assert.equal(result.value.template, "default");
      assert.deepEqual(result.value.content.summary, "");
    }
  });

  it("rejects unsupported templates", () => {
    const result = validateCreateCvInput({ template: "unknown-template" });
    assert.equal(result.ok, false);
  });

  it("rejects invalid content shape", () => {
    const result = sanitizeCvContent([]);
    assert.equal(result.ok, false);
  });

  it("allows flexible custom sections", () => {
    const result = sanitizeCvContent({
      ...createEmptyCvContent(),
      awards: [{ name: "Example award" }],
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.ok(Array.isArray(result.value.awards));
    }
  });

  it("requires at least one field on update", () => {
    const result = validateUpdateCvInput({});
    assert.equal(result.ok, false);
  });
});
