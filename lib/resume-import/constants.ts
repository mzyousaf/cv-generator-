export const RESUME_IMPORT_MAX_FILE_BYTES = 5 * 1024 * 1024;

export const RESUME_IMPORT_MAX_EXTRACTED_TEXT_LENGTH = 150_000;

export const RESUME_IMPORT_ALLOWED_EXTENSIONS = [".pdf", ".docx"] as const;

export type ResumeImportFileKind = "pdf" | "docx";

export const RESUME_IMPORT_ACCEPT =
  ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
