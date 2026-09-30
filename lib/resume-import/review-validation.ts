import { sanitizeImportReviewState } from "@/lib/resume-import/finalize-import";

export type ImportReviewValidationResult =
  | { ok: true }
  | { ok: false; message: string };

export function validateImportReviewState(
  state: unknown,
): ImportReviewValidationResult {
  const prepared = sanitizeImportReviewState(state);
  if (!prepared.ok) {
    return { ok: false, message: prepared.message };
  }

  return { ok: true };
}
