import { RESUME_IMPORT_MAX_EXTRACTED_TEXT_LENGTH } from "@/lib/resume-import/constants";

export function normalizeExtractedResumeText(raw: string): string {
  let text = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  text = text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");

  text = text.replace(/\n{3,}/g, "\n\n");

  text = text.trim();

  if (text.length > RESUME_IMPORT_MAX_EXTRACTED_TEXT_LENGTH) {
    text = text.slice(0, RESUME_IMPORT_MAX_EXTRACTED_TEXT_LENGTH);
  }

  return text;
}
