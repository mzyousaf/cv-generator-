export async function extractPdfText(buffer: Buffer): Promise<string> {
  // pdf-parse v2 exposes a class; v1's default-export function no longer exists.
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: new Uint8Array(buffer) });

  try {
    const result = await parser.getText();
    return typeof result.text === "string" ? result.text : "";
  } finally {
    await parser.destroy();
  }
}
