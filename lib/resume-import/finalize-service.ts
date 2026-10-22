import type { CreateCvPayload } from "@/lib/cv/service";
import type { CvResult } from "@/lib/cv/errors";
import type { CvRecord } from "@/lib/cv/serialize";
import {
  RESUME_IMPORT_ERROR_CODES,
  RESUME_IMPORT_ERROR_MESSAGES,
  resumeImportError,
  type ResumeImportResult,
} from "@/lib/resume-import/errors";
import { sanitizeImportReviewState } from "@/lib/resume-import/finalize-import";

export type ResumeImportFinalizeDeps = {
  createCv: (input: CreateCvPayload) => Promise<CvResult<CvRecord>>;
};

export function createResumeImportFinalizeService(deps: ResumeImportFinalizeDeps) {
  return {
    async createFromReview(
      reviewState: unknown,
    ): Promise<ResumeImportResult<{ cvId: string }>> {
      const prepared = sanitizeImportReviewState(reviewState);
      if (!prepared.ok) {
        return resumeImportError(
          RESUME_IMPORT_ERROR_CODES.INVALID_REVIEW,
          prepared.message,
        );
      }

      const result = await deps.createCv({
        title: prepared.value.title,
        template: prepared.value.template,
        content: prepared.value.content,
      });

      if (!result.success) {
        // Limits keep their own message so users know to wait or tidy up.
        const limited = result.error.code === "RATE_LIMITED" || result.error.code === "LIMIT_REACHED";
        return resumeImportError(
          RESUME_IMPORT_ERROR_CODES.CREATE_FAILED,
          limited ? result.error.message : RESUME_IMPORT_ERROR_MESSAGES.CREATE_FAILED,
        );
      }

      return { success: true, data: { cvId: result.data.id } };
    },
  };
}
