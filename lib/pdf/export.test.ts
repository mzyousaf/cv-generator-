import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { builderStateToContentPatch } from "@/lib/cv/builder-mapper";
import { createEmptyBuilderState } from "@/lib/cv/builder-types";
import { buildCvDocumentView } from "@/components/cv-templates/view-model";
import {
  CV_ERROR_CODES,
  CV_ERROR_MESSAGES,
} from "@/lib/cv/errors";
import type { CvRecord } from "@/lib/cv/serialize";
import { PDF_ERROR_CODES } from "@/lib/pdf/errors";
import { buildPdfFilename } from "@/lib/pdf/filename";
import { createCvExportService } from "@/lib/pdf/export-service";
import { PdfGenerationError } from "@/lib/pdf/errors";
import type { CvTemplateId } from "@/lib/cv/constants";

const CV_ID = "507f1f77bcf86cd799439011";

function sampleCv(template: CvTemplateId): CvRecord {
  const state = createEmptyBuilderState("Product Manager CV", template);
  state.summary = "Experienced product manager.";
  state.skills = ["Roadmapping"];

  return {
    id: CV_ID,
    title: "Product Manager CV",
    template,
    content: builderStateToContentPatch(state) as CvRecord["content"],
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
  };
}

describe("PDF filename generation", () => {
  it("sanitizes unsafe filename characters", () => {
    assert.equal(
      buildPdfFilename('  Senior / Engineer: CV  '),
      "Senior-Engineer-CV.pdf",
    );
  });

  it("truncates long titles at a word boundary", () => {
    assert.equal(
      buildPdfFilename(
        "Senior Staff Software Engineer — Platform & Developer Experience CV (Berlin / Remote, 2026 applications)",
      ),
      "Senior-Staff-Software-Engineer-Platform-Developer-Experience-CV-Berlin-Remote.pdf",
    );
  });

  it("falls back to cv.pdf when title is empty", () => {
    assert.equal(buildPdfFilename("   "), "cv.pdf");
  });
});

describe("CV PDF export service", () => {
  it("requires authentication", async () => {
    const service = createCvExportService({
      getCvForCurrentUser: async () => ({
        success: false,
        error: {
          code: CV_ERROR_CODES.UNAUTHENTICATED,
          message: CV_ERROR_MESSAGES.UNAUTHENTICATED,
        },
      }),
      renderPdf: async () => Buffer.from("pdf"),
    });

    const result = await service.exportCvPdfById(CV_ID);
    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.code, CV_ERROR_CODES.UNAUTHENTICATED);
    }
  });

  it("returns not found for missing CVs", async () => {
    const service = createCvExportService({
      getCvForCurrentUser: async () => ({
        success: false,
        error: {
          code: CV_ERROR_CODES.NOT_FOUND,
          message: CV_ERROR_MESSAGES.NOT_FOUND,
        },
      }),
      renderPdf: async () => Buffer.from("pdf"),
    });

    const result = await service.exportCvPdfById(CV_ID);
    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.code, CV_ERROR_CODES.NOT_FOUND);
    }
  });

  it("returns forbidden for non-owned CVs", async () => {
    const service = createCvExportService({
      getCvForCurrentUser: async () => ({
        success: false,
        error: {
          code: CV_ERROR_CODES.FORBIDDEN,
          message: CV_ERROR_MESSAGES.FORBIDDEN,
        },
      }),
      renderPdf: async () => Buffer.from("pdf"),
    });

    const result = await service.exportCvPdfById(CV_ID);
    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.code, CV_ERROR_CODES.FORBIDDEN);
    }
  });

  for (const templateId of ["default", "classic", "modern"] as const) {
    it(`exports owned CVs using the ${templateId} template`, async () => {
      let renderedTemplate: string | null = null;
      const service = createCvExportService({
        getCvForCurrentUser: async () => ({
          success: true,
          data: sampleCv(templateId),
        }),
        renderPdf: async (_view, template) => {
          renderedTemplate = template;
          return Buffer.from(`pdf-${template}`);
        },
      });

      const result = await service.exportCvPdfById(CV_ID);
      assert.equal(result.success, true);
      if (result.success) {
        assert.equal(result.data.templateId, templateId);
        assert.equal(result.data.filename, "Product-Manager-CV.pdf");
        assert.equal(renderedTemplate, templateId);
      }
    });
  }

  it("uses saved CV data from the service and ignores client-only overrides", async () => {
    let renderedViewName = "";
    const service = createCvExportService({
      getCvForCurrentUser: async () => ({
        success: true,
        data: sampleCv("default"),
      }),
      renderPdf: async (view) => {
        renderedViewName = view.displayName;
        return Buffer.from("pdf");
      },
    });

    const result = await service.exportCvPdfById(CV_ID);
    assert.equal(result.success, true);
    assert.equal(renderedViewName, "Your Name");
  });

  it("handles PDF generation failures gracefully", async () => {
    const service = createCvExportService({
      getCvForCurrentUser: async () => ({
        success: true,
        data: sampleCv("default"),
      }),
      renderPdf: async () => {
        throw new PdfGenerationError();
      },
    });

    const result = await service.exportCvPdfById(CV_ID);
    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.code, PDF_ERROR_CODES.EXPORT_FAILED);
    }
  });
});

describe("PDF view mapping", () => {
  it("maps CV records into document views for rendering", () => {
    const state = createEmptyBuilderState("Engineer CV", "modern");
    state.personal.fullName = "Alex Morgan";
    const view = buildCvDocumentView(state);
    assert.equal(view.displayName, "Alex Morgan");
    assert.equal(view.template, "modern");
  });
});
