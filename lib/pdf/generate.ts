import { renderToBuffer } from "@react-pdf/renderer";
import type { CvTemplateId } from "@/lib/cv/constants";
import type { CvDocumentView } from "@/components/cv-templates/view-model";
import { PdfGenerationError } from "@/lib/pdf/errors";
import { createCvPdfDocument } from "@/lib/pdf/render-cv-pdf";

export async function renderCvPdfBuffer(
  view: CvDocumentView,
  templateId: CvTemplateId | string,
): Promise<Buffer> {
  try {
    const document = createCvPdfDocument(view, templateId);
    const buffer = await renderToBuffer(document);
    return Buffer.from(buffer);
  } catch {
    throw new PdfGenerationError();
  }
}
