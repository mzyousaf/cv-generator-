"use server";

import { getCurrentUser } from "@/lib/auth/get-current-user";
import { resumeImportAuthError } from "@/lib/resume-import/auth-guard";
import {
  RESUME_IMPORT_ERROR_CODES,
  RESUME_IMPORT_ERROR_MESSAGES,
  resumeImportError,
  type ResumeImportResult,
} from "@/lib/resume-import/errors";
import type {
  ResumeImportExtractionPayload,
  ResumeImportReviewPayload,
} from "@/lib/resume-import/service";
import { resumeImportFinalizeService } from "@/lib/resume-import/finalize-service-instance";
import { resumeImportParseService } from "@/lib/resume-import/parse-service-instance";
import { resumeImportService } from "@/lib/resume-import/service-instance";
import { RESUME_IMPORT_MIN_PARSE_TEXT_LENGTH } from "@/lib/resume-import/parse-constants";
import { LOCALES, type Locale } from "@/lib/i18n/preferences";

async function readUploadFromFormData(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return resumeImportError(
      RESUME_IMPORT_ERROR_CODES.INVALID_INPUT,
      RESUME_IMPORT_ERROR_MESSAGES.INVALID_INPUT,
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  return {
    success: true as const,
    data: { buffer, filename: file.name },
  };
}

export async function extractResumeImportAction(
  formData: FormData,
): Promise<ResumeImportResult<ResumeImportExtractionPayload>> {
  const user = await getCurrentUser();
  const authError = resumeImportAuthError(user);
  if (authError) {
    return authError;
  }

  const upload = await readUploadFromFormData(formData);
  if (!upload.success) {
    return upload;
  }

  return resumeImportService.processUpload({
    buffer: upload.data.buffer,
    filename: upload.data.filename,
  });
}

/**
 * Reads an uploaded resume with AI: text (or the PDF itself when it has no
 * text layer) is converted into builder sections, plus a photo candidate.
 */
export async function importResumeForReviewAction(
  formData: FormData,
): Promise<ResumeImportResult<ResumeImportReviewPayload>> {
  const user = await getCurrentUser();
  const authError = resumeImportAuthError(user);
  if (authError) {
    return authError;
  }

  const upload = await readUploadFromFormData(formData);
  if (!upload.success) {
    return upload;
  }

  const read = await resumeImportService.readUpload({
    buffer: upload.data.buffer,
    filename: upload.data.filename,
  });
  if (!read.success) {
    return read;
  }

  const { upload: file, text, photoCandidate } = read.data;
  const requestedLocale = formData.get("locale");
  const fallbackLocale = (LOCALES as readonly unknown[]).includes(requestedLocale)
    ? (requestedLocale as Locale)
    : undefined;
  const hasText = text.trim().length >= RESUME_IMPORT_MIN_PARSE_TEXT_LENGTH;

  if (!hasText && file.kind !== "pdf") {
    return resumeImportError(
      RESUME_IMPORT_ERROR_CODES.TEXT_TOO_SHORT,
      RESUME_IMPORT_ERROR_MESSAGES.TEXT_TOO_SHORT,
    );
  }

  const parsed = hasText
    ? await resumeImportParseService.parseExtractedText(text, fallbackLocale)
    : await resumeImportParseService.parsePdfFile({
        filename: file.filename,
        buffer: file.buffer,
        fallbackLocale,
      });

  if (!parsed.success) {
    return parsed;
  }

  return {
    success: true,
    data: {
      filename: file.filename,
      fileType: file.kind,
      fileSizeBytes: file.sizeBytes,
      reviewState: parsed.data,
      photoCandidate,
    },
  };
}

export async function createResumeFromImportAction(
  reviewState: unknown,
): Promise<ResumeImportResult<{ cvId: string }>> {
  const user = await getCurrentUser();
  const authError = resumeImportAuthError(user);
  if (authError) {
    return authError;
  }

  return resumeImportFinalizeService.createFromReview(reviewState);
}
