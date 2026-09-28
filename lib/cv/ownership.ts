import { CV_ERROR_CODES, type CvErrorCode } from "@/lib/cv/errors";

export type OwnershipCheckResult =
  | { ok: true }
  | { ok: false; code: CvErrorCode };

export function checkCvOwnership(
  cv: { userId: string } | null | undefined,
  authenticatedUserId: string | null | undefined,
): OwnershipCheckResult {
  if (!authenticatedUserId) {
    return { ok: false, code: CV_ERROR_CODES.UNAUTHENTICATED };
  }

  if (!cv) {
    return { ok: false, code: CV_ERROR_CODES.NOT_FOUND };
  }

  if (cv.userId !== authenticatedUserId) {
    return { ok: false, code: CV_ERROR_CODES.FORBIDDEN };
  }

  return { ok: true };
}
