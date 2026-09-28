export const PDF_ERROR_CODES = {
  EXPORT_FAILED: "EXPORT_FAILED",
} as const;

export type PdfErrorCode = (typeof PDF_ERROR_CODES)[keyof typeof PDF_ERROR_CODES];

export const PDF_ERROR_MESSAGES = {
  EXPORT_FAILED: "Could not generate the PDF. Please try again.",
} as const;

export class PdfGenerationError extends Error {
  constructor(message = "PDF generation failed") {
    super(message);
    this.name = "PdfGenerationError";
  }
}
