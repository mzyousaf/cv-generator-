import { cvService } from "@/lib/cv/service";
import { createCvExportService } from "@/lib/pdf/export-service";
import { renderCvPdfBuffer } from "@/lib/pdf/generate";

export const cvExportService = createCvExportService({
  getCvForCurrentUser: cvService.getCvForCurrentUser.bind(cvService),
  renderPdf: renderCvPdfBuffer,
});
