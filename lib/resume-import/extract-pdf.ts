type PdfParseResult = { text?: string };
type PdfParseFn = (data: Buffer) => Promise<PdfParseResult>;

export async function extractPdfText(buffer: Buffer): Promise<string> {
  const pdfParseModule = await import("pdf-parse");
  const pdfParse = (
    "default" in pdfParseModule ? pdfParseModule.default : pdfParseModule
  ) as PdfParseFn;

  const result = await pdfParse(buffer);
  return typeof result.text === "string" ? result.text : "";
}
