import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildCvDocumentView } from "@/components/cv-templates/view-model";
import { templatePreviewSample } from "@/components/cv-templates/sample-preview-state";
import { formatDateRange } from "@/components/cv-templates/utils/format-dates";
import { CV_TEMPLATE_IDS, REGIONAL_TEMPLATE_IDS } from "@/lib/cv/constants";
import { CV_DOCUMENT_LABELS } from "@/lib/cv/document-labels";
import { buildRegionalDocumentModel } from "@/lib/cv/document-model";
import {
  DEFAULT_TEMPLATE_FOR_LOCALE,
  getRegionalTemplateSpec,
  recommendedTemplateIds,
  REGIONAL_TEMPLATES,
} from "@/lib/cv/template-catalog";
import { LOCALES } from "@/lib/i18n/preferences";

describe("regional template catalog", () => {
  it("has exactly one spec per regional template id", () => {
    assert.equal(REGIONAL_TEMPLATES.length, REGIONAL_TEMPLATE_IDS.length);
    for (const id of REGIONAL_TEMPLATE_IDS) {
      assert.ok(getRegionalTemplateSpec(id), id);
    }
  });

  it("uses only sidebar colours on sidebar layouts", () => {
    for (const spec of REGIONAL_TEMPLATES) {
      assert.equal(Boolean(spec.sidebarColor), spec.layout === "sidebar", spec.id);
    }
  });

  it("recommends regional templates and a valid default for every language", () => {
    for (const locale of LOCALES) {
      assert.ok(recommendedTemplateIds(locale).length > 0, locale);
      assert.ok((CV_TEMPLATE_IDS as readonly string[]).includes(DEFAULT_TEMPLATE_FOR_LOCALE[locale]));
    }
    assert.ok(recommendedTemplateIds("de").includes("lebenslauf"));
    assert.ok(recommendedTemplateIds("ar").includes("gulf-cv"));
  });
});

describe("CV document language", () => {
  it("defines every label in every language", () => {
    const keys = Object.keys(CV_DOCUMENT_LABELS.en);
    for (const locale of LOCALES) {
      for (const key of keys) {
        const value = CV_DOCUMENT_LABELS[locale][key as keyof typeof CV_DOCUMENT_LABELS.en];
        assert.ok(value && value.trim(), `${locale}.${key}`);
      }
    }
  });

  it("formats dates in the document language", () => {
    assert.equal(formatDateRange("2021-03", "", true, { locale: "de-DE", present: "heute" }), "März 2021 – heute");
    assert.equal(formatDateRange("2021-03", "2022-01", false, { locale: "en-GB" }), "Mar 2021 – Jan 2022");
  });

  it("builds right-to-left Arabic documents with Arabic headings", () => {
    const view = buildCvDocumentView(templatePreviewSample("ar"));
    assert.equal(view.dir, "rtl");
    const model = buildRegionalDocumentModel(view, getRegionalTemplateSpec("gulf-cv")!);
    assert.equal(model.script, "arabic");
    assert.ok(model.sections.some((section) => section.title === "الخبرة العملية"));
    assert.ok(model.sections.some((section) => section.placement === "side"));
  });

  it("shows personal details only for formats that expect them", () => {
    const view = buildCvDocumentView(templatePreviewSample("de"));
    const lebenslauf = buildRegionalDocumentModel(view, getRegionalTemplateSpec("lebenslauf")!);
    const us = buildRegionalDocumentModel(view, getRegionalTemplateSpec("us-resume")!);
    assert.deepEqual(lebenslauf.details.map((pair) => pair.label), ["Geburtsdatum", "Staatsangehörigkeit"]);
    assert.deepEqual(us.details, []);
  });
});
