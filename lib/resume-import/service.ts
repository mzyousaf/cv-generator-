import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import type { ResumeImportFileKind } from "@/lib/resume-import/constants";
import {
  RESUME_IMPORT_ERROR_CODES,
  RESUME_IMPORT_ERROR_MESSAGES,
  resumeImportError,
  type ResumeImportResult,
} from "@/lib/resume-import/errors";
import { normalizeExtractedResumeText } from "@/lib/resume-import/normalize-text";
import {
  validateResumeUploadInput,
  type ValidatedResumeUpload,
} from "@/lib/resume-import/validation";

export type ResumeImportExtractionPayload = {
  filename: string;
  fileType: ResumeImportFileKind;
  fileSizeBytes: number;
  extractedText: string;
  characterCount: number;
};

export type ResumeImportReviewPayload = {
  filename: string;
  fileType: ResumeImportFileKind;
  fileSizeBytes: number;
  reviewState: CvBuilderFormState;
};

export type ResumeImportExtractors = {
  extractPdf: (buffer: Buffer) => Promise<string>;
  extractDocx: (buffer: Buffer) => Promise<string>;
};

export function createResumeImportService(extractors: ResumeImportExtractors) {
  async function extractTextFromValidated(
    upload: ValidatedResumeUpload,
  ): Promise<ResumeImportResult<string>> {
    try {
      const raw =
        upload.kind === "pdf"
          ? await extractors.extractPdf(upload.buffer)
          : await extractors.extractDocx(upload.buffer);

      const normalized = normalizeExtractedResumeText(raw);

      if (!normalized) {
        return resumeImportError(
          RESUME_IMPORT_ERROR_CODES.NO_READABLE_TEXT,
          upload.kind === "pdf"
            ? RESUME_IMPORT_ERROR_MESSAGES.NO_READABLE_TEXT
            : "We couldn't find readable text in this document. Try a different DOCX export.",
        );
      }

      return { success: true, data: normalized };
    } catch {
      return resumeImportError(
        RESUME_IMPORT_ERROR_CODES.EXTRACTION_FAILED,
        RESUME_IMPORT_ERROR_MESSAGES.EXTRACTION_FAILED,
      );
    }
  }

  async function processUpload(input: {
    buffer: Buffer;
    filename: string;
  }): Promise<ResumeImportResult<ResumeImportExtractionPayload>> {
    const validated = validateResumeUploadInput(input.buffer, input.filename);
    if (!validated.success) {
      return validated;
    }

    const textResult = await extractTextFromValidated(validated.data);
    if (!textResult.success) {
      return textResult;
    }

    return {
      success: true,
      data: {
        filename: validated.data.filename,
        fileType: validated.data.kind,
        fileSizeBytes: validated.data.sizeBytes,
        extractedText: textResult.data,
        characterCount: textResult.data.length,
      },
    };
  }

  return { processUpload, extractTextFromValidated };
}
