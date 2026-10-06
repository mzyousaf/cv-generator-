import { pickPhotoCandidate } from "@/lib/resume-import/photo-candidate";

async function openPdf(buffer: Buffer) {
  const { PDFParse } = await import("pdf-parse");
  return new PDFParse({ data: new Uint8Array(buffer) });
}

export async function extractPdfText(buffer: Buffer): Promise<string> {
  const parser = await openPdf(buffer);
  try {
    const result = await parser.getText();
    return typeof result.text === "string" ? result.text : "";
  } finally {
    await parser.destroy();
  }
}

/** Best-effort: returns the most portrait-like image on the first two pages. */
export async function extractPdfPhoto(buffer: Buffer): Promise<string | null> {
  const parser = await openPdf(buffer);
  try {
    const result = await parser.getImage({
      first: 2,
      imageThreshold: 59,
      imageBuffer: false,
      imageDataUrl: true,
    });
    return pickPhotoCandidate(
      result.pages.flatMap((page) =>
        page.images.map((image) => ({
          width: image.width,
          height: image.height,
          dataUrl: image.dataUrl,
        })),
      ),
    );
  } catch {
    return null;
  } finally {
    await parser.destroy();
  }
}
