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
  /** Portrait found in the document (data URL); the browser crops/compresses it. */
  photoCandidate: string | null;
};

export type ResumeImportReadPayload = {
  upload: ValidatedResumeUpload;
  /** Normalized text; may be empty for scanned PDFs (AI OCR handles those). */
  text: string;
  photoCandidate: string | null;
};

export type ResumeImportExtractors = {
  extractPdf: (buffer: Buffer) => Promise<string>;
  extractDocx: (buffer: Buffer) => Promise<string>;
  extractPdfPhoto?: (buffer: Buffer) => Promise<string | null>;
  extractDocxPhoto?: (buffer: Buffer) => Promise<string | null>;
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

  async function extractPhoto(upload: ValidatedResumeUpload): Promise<string | null> {
    const extract =
      upload.kind === "pdf" ? extractors.extractPdfPhoto : extractors.extractDocxPhoto;
    if (!extract) {
      return null;
    }
    try {
      return await extract(upload.buffer);
    } catch {
      return null;
    }
  }

  /** Validates the file and pulls out its text and photo for AI parsing. */
  async function readUpload(input: {
    buffer: Buffer;
    filename: string;
  }): Promise<ResumeImportResult<ResumeImportReadPayload>> {
    const validated = validateResumeUploadInput(input.buffer, input.filename);
    if (!validated.success) {
      return validated;
    }

    const upload = validated.data;
    let text = "";
    try {
      const raw =
        upload.kind === "pdf"
          ? await extractors.extractPdf(upload.buffer)
          : await extractors.extractDocx(upload.buffer);
      text = normalizeExtractedResumeText(raw);
    } catch {
      // A PDF can still be read by the model directly; a broken DOCX cannot.
      if (upload.kind === "docx") {
        return resumeImportError(
          RESUME_IMPORT_ERROR_CODES.EXTRACTION_FAILED,
          RESUME_IMPORT_ERROR_MESSAGES.EXTRACTION_FAILED,
        );
      }
    }

    return {
      success: true,
      data: { upload, text, photoCandidate: await extractPhoto(upload) },
    };
  }

  return { processUpload, extractTextFromValidated, readUpload };
}
