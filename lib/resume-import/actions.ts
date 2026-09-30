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

  const extraction = await resumeImportService.processUpload({
    buffer: upload.data.buffer,
    filename: upload.data.filename,
  });

  if (!extraction.success) {
    return extraction;
  }

  const parsed = await resumeImportParseService.parseExtractedText(
    extraction.data.extractedText,
  );

  if (!parsed.success) {
    return parsed;
  }

  return {
    success: true,
    data: {
      filename: extraction.data.filename,
      fileType: extraction.data.fileType,
      fileSizeBytes: extraction.data.fileSizeBytes,
      reviewState: parsed.data,
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
