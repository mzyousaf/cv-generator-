export const RESUME_IMPORT_ERROR_CODES = {
  UNAUTHENTICATED: "UNAUTHENTICATED",
  INVALID_INPUT: "INVALID_INPUT",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  UNSUPPORTED_FORMAT: "UNSUPPORTED_FORMAT",
  EMPTY_FILE: "EMPTY_FILE",
  NO_READABLE_TEXT: "NO_READABLE_TEXT",
  EXTRACTION_FAILED: "EXTRACTION_FAILED",
  AI_NOT_CONFIGURED: "AI_NOT_CONFIGURED",
  AI_UNAVAILABLE: "AI_UNAVAILABLE",
  TEXT_TOO_SHORT: "TEXT_TOO_SHORT",
  DESCRIPTION_TOO_SHORT: "DESCRIPTION_TOO_SHORT",
  MALFORMED_PARSE: "MALFORMED_PARSE",
  PARSING_FAILED: "PARSING_FAILED",
  PARSING_TIMEOUT: "PARSING_TIMEOUT",
  EMPTY_PARSE_RESULT: "EMPTY_PARSE_RESULT",
  INVALID_REVIEW: "INVALID_REVIEW",
  CREATE_FAILED: "CREATE_FAILED",
} as const;

export type ResumeImportErrorCode =
  (typeof RESUME_IMPORT_ERROR_CODES)[keyof typeof RESUME_IMPORT_ERROR_CODES];

export type ResumeImportError = {
  code: ResumeImportErrorCode;
  message: string;
};

export type ResumeImportResult<T> =
  | { success: true; data: T }
  | { success: false; error: ResumeImportError };

export function resumeImportError(
  code: ResumeImportErrorCode,
  message: string,
): ResumeImportResult<never> {
  return { success: false, error: { code, message } };
}

export const RESUME_IMPORT_ERROR_MESSAGES: Record<
  ResumeImportErrorCode,
  string
> = {
  UNAUTHENTICATED: "You must be signed in to import a resume.",
  INVALID_INPUT: "Please choose a valid PDF or DOCX file.",
  FILE_TOO_LARGE: "This file is too large. Maximum size is 5 MB.",
  UNSUPPORTED_FORMAT:
    "Unsupported file type. Upload a text-based PDF or DOCX file (.doc is not supported).",
  EMPTY_FILE: "This file is empty. Choose a different resume file.",
  NO_READABLE_TEXT:
    "We couldn't find readable text in this PDF. Try uploading a text-based PDF or DOCX file.",
  EXTRACTION_FAILED:
    "We couldn't read this file. Try a different PDF or DOCX export of your resume.",
  AI_NOT_CONFIGURED:
    "Resume import parsing is not available right now. Try again later or create a resume manually.",
  AI_UNAVAILABLE:
    "We couldn't reach the parsing service. Wait a moment and try again.",
  TEXT_TOO_SHORT:
    "This file did not contain enough text to import. Try a text-based PDF or DOCX file.",
  DESCRIPTION_TOO_SHORT:
    "Tell us a bit more about yourself (a few sentences at least) so AI can build your resume.",
  MALFORMED_PARSE:
    "We couldn't read the parsed resume data. Try importing again or choose another file.",
  PARSING_FAILED:
    "Something went wrong while parsing your resume. Try again or choose another file.",
  PARSING_TIMEOUT:
    "Parsing took too long. Try again with a shorter resume file.",
  EMPTY_PARSE_RESULT:
    "We couldn't find enough resume information to review. Try another file or edit fields manually after retrying.",
  INVALID_REVIEW: "Some imported fields are invalid. Fix them and try again.",
  CREATE_FAILED: "We couldn't save your resume. Try again in a moment.",
};
