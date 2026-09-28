import { cvRecordToBuilderState } from "@/lib/cv/builder-mapper";
import { buildCvDocumentView } from "@/components/cv-templates/view-model";
import { CV_ERROR_CODES, type CvError } from "@/lib/cv/errors";
import type { CvService } from "@/lib/cv/service";
import type { CvTemplateId } from "@/lib/cv/constants";
import type { CvDocumentView } from "@/components/cv-templates/view-model";
import type { CvRecord } from "@/lib/cv/serialize";
import { resolveTemplateId } from "@/lib/cv/template-registry";
import {
  PDF_ERROR_CODES,
  PDF_ERROR_MESSAGES,
  PdfGenerationError,
} from "@/lib/pdf/errors";
import { buildPdfFilename } from "@/lib/pdf/filename";

export type CvPdfExportData = {
  pdf: Buffer;
  filename: string;
  templateId: string;
};

export type CvPdfExportResult =
  | { success: true; data: CvPdfExportData }
  | { success: false; error: CvError | PdfExportError };

export type PdfExportError = {
  code: typeof PDF_ERROR_CODES.EXPORT_FAILED;
  message: string;
};

type RenderPdfFn = (
  view: CvDocumentView,
  templateId: CvTemplateId | string,
) => Promise<Buffer>;

type CvExportServiceDeps = {
  getCvForCurrentUser: CvService["getCvForCurrentUser"];
  renderPdf: RenderPdfFn;
};

function mapCvRecordToView(cv: CvRecord) {
  const state = cvRecordToBuilderState(cv.title, cv.content, cv.template);
  return {
    view: buildCvDocumentView(state),
    templateId: resolveTemplateId(cv.template),
    filename: buildPdfFilename(cv.title),
  };
}

export function createCvExportService(deps: CvExportServiceDeps) {
  return {
    async exportCvPdfById(cvId: string): Promise<CvPdfExportResult> {
      const cvResult = await deps.getCvForCurrentUser(cvId);
      if (!cvResult.success) {
        return cvResult;
      }

      const { view, templateId, filename } = mapCvRecordToView(cvResult.data);

      try {
        const pdf = await deps.renderPdf(view, templateId);
        return {
          success: true,
          data: { pdf, filename, templateId },
        };
      } catch (error) {
        if (error instanceof PdfGenerationError) {
          return {
            success: false,
            error: {
              code: PDF_ERROR_CODES.EXPORT_FAILED,
              message: PDF_ERROR_MESSAGES.EXPORT_FAILED,
            },
          };
        }

        return {
          success: false,
          error: {
            code: PDF_ERROR_CODES.EXPORT_FAILED,
            message: PDF_ERROR_MESSAGES.EXPORT_FAILED,
          },
        };
      }
    },
  };
}

export function mapExportErrorToStatusCode(error: CvError | PdfExportError): number {
  if ("code" in error && error.code === PDF_ERROR_CODES.EXPORT_FAILED) {
    return 500;
  }

  const cvError = error as CvError;
  switch (cvError.code) {
    case CV_ERROR_CODES.UNAUTHENTICATED:
      return 401;
    case CV_ERROR_CODES.FORBIDDEN:
      return 403;
    case CV_ERROR_CODES.NOT_FOUND:
      return 404;
    default:
      return 500;
  }
}
