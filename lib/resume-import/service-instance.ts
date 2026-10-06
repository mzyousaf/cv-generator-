import { extractDocxPhoto, extractDocxText } from "@/lib/resume-import/extract-docx";
import { extractPdfPhoto, extractPdfText } from "@/lib/resume-import/extract-pdf";
import { createResumeImportService } from "@/lib/resume-import/service";

export const resumeImportService = createResumeImportService({
  extractPdf: extractPdfText,
  extractDocx: extractDocxText,
  extractPdfPhoto,
  extractDocxPhoto,
});
