import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { builderStateToContentPatch } from "@/lib/cv/builder-mapper";
import { createEmptyBuilderState } from "@/lib/cv/builder-types";
import { CV_TEMPLATE_IDS } from "@/lib/cv/constants";
import {
  CV_TEMPLATE_REGISTRY,
  isCvTemplateId,
  resolveTemplateId,
} from "@/lib/cv/template-registry";
import { validateCreateCvInput } from "@/lib/cv/validation";

describe("CV template registry", () => {
  it("recognizes all supported template identifiers", () => {
    for (const templateId of CV_TEMPLATE_IDS) {
      assert.equal(isCvTemplateId(templateId), true);
      assert.ok(CV_TEMPLATE_REGISTRY.some((entry) => entry.id === templateId));
    }
  });

  it("falls back to default for invalid template identifiers", () => {
    assert.equal(resolveTemplateId("invalid-template"), "default");
    assert.equal(resolveTemplateId(undefined), "default");
  });

  it("rejects invalid template identifiers during validation", () => {
    const result = validateCreateCvInput({ template: "invalid-template" });
    assert.equal(result.ok, false);
  });

  it("does not modify CV content when only template changes", () => {
    const baseState = createEmptyBuilderState("Test CV", "default");
    baseState.summary = "Experienced engineer.";
    baseState.skills = ["TypeScript", "MongoDB"];

    const defaultContent = builderStateToContentPatch(baseState);
    const modernState = { ...baseState, template: "modern" as const };
    const modernContent = builderStateToContentPatch(modernState);

    assert.deepEqual(modernContent, defaultContent);
    assert.notEqual(baseState.template, modernState.template);
  });
});
