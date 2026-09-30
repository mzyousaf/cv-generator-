import {
  RESUME_IMPORT_ALLOWED_EXTENSIONS,
  RESUME_IMPORT_MAX_FILE_BYTES,
  type ResumeImportFileKind,
} from "@/lib/resume-import/constants";
import {
  RESUME_IMPORT_ERROR_CODES,
  RESUME_IMPORT_ERROR_MESSAGES,
  resumeImportError,
  type ResumeImportResult,
} from "@/lib/resume-import/errors";

const PDF_MAGIC = Buffer.from("%PDF");
const ZIP_MAGIC = Buffer.from("PK\x03\x04");
const OLE_MAGIC = Buffer.from([0xd0, 0xcf, 0x11, 0xe0]);

export type ValidatedResumeUpload = {
  kind: ResumeImportFileKind;
  filename: string;
  sizeBytes: number;
  buffer: Buffer;
};

function extensionFromFilename(filename: string): string {
  const lower = filename.toLowerCase().trim();
  const dot = lower.lastIndexOf(".");
  return dot >= 0 ? lower.slice(dot) : "";
}

export function detectResumeFileKind(buffer: Buffer): ResumeImportFileKind | null {
  if (buffer.length >= 4 && buffer.subarray(0, 4).equals(PDF_MAGIC)) {
    return "pdf";
  }

  if (buffer.length >= 4 && buffer.subarray(0, 4).equals(ZIP_MAGIC)) {
    if (buffer.includes(Buffer.from("word/document.xml"))) {
      return "docx";
    }
  }

  return null;
}

function isLegacyDoc(buffer: Buffer): boolean {
  return buffer.length >= 4 && buffer.subarray(0, 4).equals(OLE_MAGIC);
}

export function validateResumeUploadInput(
  buffer: Buffer,
  filename: string,
): ResumeImportResult<ValidatedResumeUpload> {
  const sizeBytes = buffer.length;

  if (sizeBytes === 0) {
    return resumeImportError(
      RESUME_IMPORT_ERROR_CODES.EMPTY_FILE,
      RESUME_IMPORT_ERROR_MESSAGES.EMPTY_FILE,
    );
  }

  if (sizeBytes > RESUME_IMPORT_MAX_FILE_BYTES) {
    return resumeImportError(
      RESUME_IMPORT_ERROR_CODES.FILE_TOO_LARGE,
      RESUME_IMPORT_ERROR_MESSAGES.FILE_TOO_LARGE,
    );
  }

  const extension = extensionFromFilename(filename);

  if (extension === ".doc" || isLegacyDoc(buffer)) {
    return resumeImportError(
      RESUME_IMPORT_ERROR_CODES.UNSUPPORTED_FORMAT,
      RESUME_IMPORT_ERROR_MESSAGES.UNSUPPORTED_FORMAT,
    );
  }

  const kind = detectResumeFileKind(buffer);

  if (!kind) {
    return resumeImportError(
      RESUME_IMPORT_ERROR_CODES.UNSUPPORTED_FORMAT,
      RESUME_IMPORT_ERROR_MESSAGES.UNSUPPORTED_FORMAT,
    );
  }

  const expectedExtension =
    kind === "pdf"
      ? ".pdf"
      : (".docx" as (typeof RESUME_IMPORT_ALLOWED_EXTENSIONS)[number]);

  if (
    extension &&
    !RESUME_IMPORT_ALLOWED_EXTENSIONS.includes(
      extension as (typeof RESUME_IMPORT_ALLOWED_EXTENSIONS)[number],
    )
  ) {
    return resumeImportError(
      RESUME_IMPORT_ERROR_CODES.UNSUPPORTED_FORMAT,
      RESUME_IMPORT_ERROR_MESSAGES.UNSUPPORTED_FORMAT,
    );
  }

  if (extension && extension !== expectedExtension) {
    return resumeImportError(
      RESUME_IMPORT_ERROR_CODES.UNSUPPORTED_FORMAT,
      RESUME_IMPORT_ERROR_MESSAGES.UNSUPPORTED_FORMAT,
    );
  }

  return {
    success: true,
    data: {
      kind,
      filename: filename.trim() || (kind === "pdf" ? "resume.pdf" : "resume.docx"),
      sizeBytes,
      buffer,
    },
  };
}

/** Client-side checks (filename + size only). */
export function validateResumeFileClient(file: File): string | null {
  const name = file.name.toLowerCase();
  if (!name.endsWith(".pdf") && !name.endsWith(".docx")) {
    return "Upload a PDF or DOCX file (.doc is not supported).";
  }
  if (file.size === 0) {
    return "This file is empty.";
  }
  if (file.size > RESUME_IMPORT_MAX_FILE_BYTES) {
    return "This file is too large. Maximum size is 5 MB.";
  }
  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function fileKindLabel(kind: ResumeImportFileKind): string {
  return kind === "pdf" ? "PDF" : "DOCX";
}
