import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { builderStateToContentPatch, cvRecordToBuilderState } from "@/lib/cv/builder-mapper";
import { createEmptyBuilderState } from "@/lib/cv/builder-types";
import { buildCvDocumentView } from "@/components/cv-templates/view-model";
import { createEmptyCvContent, sanitizeCvContent } from "@/lib/cv/validation";
import {
  createDefaultSectionSettings,
  DEFAULT_MANAGEABLE_SECTION_ORDER,
  getVisibleSectionOrder,
  moveSection,
  sanitizeSectionSettings,
  toggleSectionVisibility,
} from "@/lib/cv/section-settings";

describe("section settings", () => {
  it("uses default section order", () => {
    const settings = createDefaultSectionSettings();
    assert.deepEqual(settings.order, DEFAULT_MANAGEABLE_SECTION_ORDER);
    assert.deepEqual(settings.hidden, []);
  });

  it("falls back for existing CV without settings", () => {
    const state = cvRecordToBuilderState("CV", createEmptyCvContent(), "default");
    assert.deepEqual(state.sectionSettings.order, DEFAULT_MANAGEABLE_SECTION_ORDER);
  });

  it("accepts valid custom ordering", () => {
    const sanitized = sanitizeSectionSettings({
      order: ["skills", "summary", "workExperience", "education", "projects", "certifications", "languages"],
      hidden: [],
    });
    assert.equal(sanitized.order[0], "skills");
    assert.equal(sanitized.order[1], "summary");
  });

  it("deduplicates section IDs in order", () => {
    const sanitized = sanitizeSectionSettings({
      order: ["skills", "skills", "summary"],
      hidden: [],
    });
    assert.equal(sanitized.order.filter((id) => id === "skills").length, 1);
    assert.equal(sanitized.order.includes("summary"), true);
  });

  it("ignores unknown section IDs", () => {
    const sanitized = sanitizeSectionSettings({
      order: ["skills", "unknown", "summary"],
      hidden: ["fake"],
    });
    assert.equal(sanitized.order[0], "skills");
    assert.deepEqual(sanitized.hidden, []);
  });

  it("handles malformed settings", () => {
    assert.deepEqual(sanitizeSectionSettings(null).order, DEFAULT_MANAGEABLE_SECTION_ORDER);
    assert.deepEqual(sanitizeSectionSettings("bad").order, DEFAULT_MANAGEABLE_SECTION_ORDER);
  });

  it("rejects prototype pollution keys", () => {
    const sanitized = sanitizeSectionSettings({
      order: ["summary"],
      hidden: [],
      prototype: "bad",
    });
    assert.deepEqual(sanitized.order, DEFAULT_MANAGEABLE_SECTION_ORDER);
  });

  it("hide does not remove content", () => {
    const state = createEmptyBuilderState();
    state.summary = "Keep this text";
    const hidden = toggleSectionVisibility(state.sectionSettings, "summary");
    assert.equal(state.summary, "Keep this text");
    assert.equal(hidden.hidden.includes("summary"), true);
  });

  it("show restores visibility in preview order", () => {
    let settings = toggleSectionVisibility(createDefaultSectionSettings(), "skills");
    settings = toggleSectionVisibility(settings, "skills");
    const visible = getVisibleSectionOrder(settings);
    assert.equal(visible.includes("skills"), true);
  });

  it("maps builder round trip with section settings", () => {
    const state = createEmptyBuilderState();
    state.sectionSettings = sanitizeSectionSettings({
      order: ["education", "summary", "workExperience", "skills", "projects", "certifications", "languages"],
      hidden: ["projects"],
    });

    const patch = builderStateToContentPatch(state);
    const roundTrip = cvRecordToBuilderState(state.title, patch as never, state.template);
    assert.deepEqual(roundTrip.sectionSettings.order, state.sectionSettings.order);
    assert.deepEqual(roundTrip.sectionSettings.hidden, ["projects"]);
  });

  it("preview uses visible section ordering", () => {
    const state = createEmptyBuilderState();
    state.summary = "Summary text";
    state.skills = ["React"];
    state.sectionSettings = sanitizeSectionSettings({
      order: ["skills", "summary", "workExperience", "education", "projects", "certifications", "languages"],
      hidden: ["summary"],
    });

    const view = buildCvDocumentView(state);
    assert.deepEqual(view.visibleSectionOrder[0], "skills");
    assert.equal(view.visibleSectionOrder.includes("summary"), false);
  });

  it("move up and move down reorder sections", () => {
    const moved = moveSection(createDefaultSectionSettings(), "education", "up");
    assert.equal(moved.order.indexOf("education") < moved.order.indexOf("workExperience"), true);
  });

  it("validates section settings through CV content sanitization", () => {
    const result = sanitizeCvContent({
      summary: "Hello",
      sectionSettings: {
        order: ["summary", "skills"],
        hidden: ["skills"],
      },
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      const settings = result.value.sectionSettings as { order: string[]; hidden: string[] };
      assert.deepEqual(settings.hidden, ["skills"]);
      assert.equal(settings.order.includes("workExperience"), true);
    }
  });
});
