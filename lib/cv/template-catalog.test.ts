import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildCvDocumentView } from "@/components/cv-templates/view-model";
import { templatePreviewSample } from "@/components/cv-templates/sample-preview-state";
import { formatDateRange } from "@/components/cv-templates/utils/format-dates";
import { CV_TEMPLATE_IDS, REGIONAL_TEMPLATE_IDS } from "@/lib/cv/constants";
import { CV_DOCUMENT_LABELS } from "@/lib/cv/document-labels";
import { buildRegionalDocumentModel } from "@/lib/cv/document-model";
import {
  browseTemplates,
  DEFAULT_TEMPLATE_FOR_LOCALE,
  getRegionalTemplateSpec,
  recommendedTemplateIds,
  REGIONAL_TEMPLATES,
  TEMPLATE_PROFILE,
  TEMPLATE_REGIONS,
  TEMPLATE_STYLES,
  templateFacets,
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

describe("template gallery", () => {
  const contrastOnWhite = (hex: string) => {
    const channel = (value: number) => {
      const c = value / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    };
    const n = Number.parseInt(hex.slice(1), 16);
    const luminance =
      0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
    return 1.05 / (luminance + 0.05);
  };

  it("has a style and popularity for every template", () => {
    for (const id of CV_TEMPLATE_IDS) {
      const profile = TEMPLATE_PROFILE[id];
      assert.ok(profile, `${id} has a profile`);
      assert.ok(TEMPLATE_STYLES.includes(profile.style), `${id} style`);
      assert.ok(profile.popularity >= 1 && profile.popularity <= 100, `${id} popularity`);
    }
  });

  it("keeps every accent readable on the white page (3:1 or better)", () => {
    for (const spec of REGIONAL_TEMPLATES) {
      assert.ok(contrastOnWhite(spec.accent) >= 3, `${spec.id} accent ${spec.accent} is too light`);
    }
  });

  it("covers every region with at least two templates", () => {
    for (const region of TEMPLATE_REGIONS) {
      const count = CV_TEMPLATE_IDS.filter((id) => templateFacets(id).region === region).length;
      assert.ok(count >= 2, `${region} has ${count} templates`);
    }
  });

  it("filters and sorts the gallery", () => {
    const name = (id: string) => id;
    const all = browseTemplates({}, "popular", "en", name, CV_TEMPLATE_IDS);
    assert.equal(all.length, CV_TEMPLATE_IDS.length);
    for (let i = 1; i < all.length; i += 1) {
      assert.ok(TEMPLATE_PROFILE[all[i - 1]].popularity >= TEMPLATE_PROFILE[all[i]].popularity);
    }

    const ats = browseTemplates({ ats: true }, "popular", "en", name, CV_TEMPLATE_IDS);
    assert.ok(ats.length > 10 && ats.every((id) => templateFacets(id).ats));

    const withPhoto = browseTemplates({ photo: "with" }, "popular", "en", name, CV_TEMPLATE_IDS);
    assert.ok(withPhoto.every((id) => templateFacets(id).photo !== "none"));

    const twoCol = browseTemplates({ columns: "two" }, "popular", "en", name, CV_TEMPLATE_IDS);
    assert.ok(twoCol.length > 5 && twoCol.every((id) => templateFacets(id).columns === "two"));

    const dach = browseTemplates({ region: "dach" }, "popular", "en", name, CV_TEMPLATE_IDS);
    assert.ok(dach.includes("lebenslauf") && dach.includes("swiss-cv"));

    assert.deepEqual(browseTemplates({ query: "swiss" }, "popular", "en", name, CV_TEMPLATE_IDS), ["swiss-cv"]);

    const recommendedDe = browseTemplates({}, "recommended", "de", name, CV_TEMPLATE_IDS);
    assert.equal(templateFacets(recommendedDe[0]).region, "dach");
  });

  it("renders every template in every language without throwing", () => {
    for (const locale of LOCALES) {
      const state = templatePreviewSample(locale);
      for (const spec of REGIONAL_TEMPLATES) {
        const view = buildCvDocumentView({ ...state, template: spec.id });
        const model = buildRegionalDocumentModel(view, spec);
        assert.ok(model.sections.length > 0, `${spec.id}/${locale}`);
      }
    }
  });
});
