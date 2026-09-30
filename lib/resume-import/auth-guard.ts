import type { CurrentUser } from "@/lib/auth/get-current-user";
import {
  RESUME_IMPORT_ERROR_CODES,
  RESUME_IMPORT_ERROR_MESSAGES,
  resumeImportError,
  type ResumeImportResult,
} from "@/lib/resume-import/errors";

export function resumeImportAuthError(
  user: CurrentUser | null,
): ResumeImportResult<never> | null {
  if (!user) {
    return resumeImportError(
      RESUME_IMPORT_ERROR_CODES.UNAUTHENTICATED,
      RESUME_IMPORT_ERROR_MESSAGES.UNAUTHENTICATED,
    );
  }
  return null;
}
