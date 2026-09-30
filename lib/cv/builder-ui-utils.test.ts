import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addSkillToList,
  certificationEntrySummary,
  clampPreviewZoom,
  DEFAULT_PREVIEW_ZOOM,
  educationEntrySummary,
  isValidBuilderMobilePane,
  languageEntrySummary,
  normalizeSkillsList,
  orderedSectionNavIds,
  PREVIEW_ZOOM_LEVELS,
  projectEntrySummary,
  removeSkillFromList,
  sectionNavHiddenState,
  stepPreviewZoom,
  workExperienceEntrySummary,
} from "@/lib/cv/builder-ui-utils";
import { createDefaultSectionSettings } from "@/lib/cv/section-settings";

describe("builder ui utils", () => {
  it("clamps preview zoom to supported levels", () => {
    assert.equal(clampPreviewZoom(40), 50);
    assert.equal(clampPreviewZoom(75), 75);
    assert.equal(clampPreviewZoom(120), 100);
    assert.deepEqual(PREVIEW_ZOOM_LEVELS, [50, 75, 100]);
    assert.equal(DEFAULT_PREVIEW_ZOOM, 75);
  });

  it("steps preview zoom within bounds", () => {
    assert.equal(stepPreviewZoom(50, "out"), 50);
    assert.equal(stepPreviewZoom(50, "in"), 75);
    assert.equal(stepPreviewZoom(100, "in"), 100);
    assert.equal(stepPreviewZoom(100, "out"), 75);
  });

  it("builds meaningful work experience summaries", () => {
    const summary = workExperienceEntrySummary({
      id: "1",
      jobTitle: "Senior Engineer",
      company: "Acme Inc.",
      location: "",
      startDate: "2023-01",
      endDate: "",
      current: true,
      description: "",
    });
    assert.equal(summary.title, "Senior Engineer");
    assert.match(summary.subtitle, /Acme Inc\./);
    assert.match(summary.subtitle, /Present/);
  });

  it("normalizes skills and prevents empty duplicates", () => {
    assert.deepEqual(normalizeSkillsList([" React ", "", "react", "Node"]), [
      "React",
      "Node",
    ]);
    assert.deepEqual(addSkillToList(["TypeScript"], "  "), ["TypeScript"]);
    assert.deepEqual(addSkillToList(["TypeScript"], "React"), [
      "TypeScript",
      "React",
    ]);
    assert.deepEqual(removeSkillFromList(["A", "B", "C"], 1), ["A", "C"]);
  });

  it("orders section navigation from settings", () => {
    const settings = createDefaultSectionSettings();
    settings.order = [
      "skills",
      "summary",
      "workExperience",
      "education",
      "projects",
      "certifications",
      "languages",
    ];
    assert.deepEqual(orderedSectionNavIds(settings), [
      "personal",
      "skills",
      "summary",
      "workExperience",
      "education",
      "projects",
      "certifications",
      "languages",
    ]);
  });

  it("reports hidden section state for nav", () => {
    const settings = createDefaultSectionSettings();
    settings.hidden = ["skills"];
    assert.equal(sectionNavHiddenState(settings, "personal"), false);
    assert.equal(sectionNavHiddenState(settings, "skills"), true);
    assert.equal(sectionNavHiddenState(settings, "summary"), false);
  });

  it("validates mobile pane values", () => {
    assert.equal(isValidBuilderMobilePane("edit"), true);
    assert.equal(isValidBuilderMobilePane("preview"), true);
    assert.equal(isValidBuilderMobilePane("other"), false);
  });

  it("builds education, project, certification, and language summaries", () => {
    assert.equal(
      educationEntrySummary({
        id: "1",
        degree: "BS CS",
        institution: "Example U",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      }).title,
      "BS CS",
    );
    assert.equal(
      projectEntrySummary({
        id: "1",
        name: "Portfolio",
        description: "",
        url: "",
      }).title,
      "Portfolio",
    );
    assert.equal(
      certificationEntrySummary({
        id: "1",
        name: "AWS",
        issuer: "Amazon",
        date: "2024-06",
        url: "",
      }).title,
      "AWS",
    );
    assert.equal(
      languageEntrySummary({
        id: "1",
        language: "Spanish",
        proficiency: "Professional",
      }).title,
      "Spanish",
    );
  });
});
