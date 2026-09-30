import { cvService } from "@/lib/cv/service";
import { createResumeImportFinalizeService } from "@/lib/resume-import/finalize-service";

export const resumeImportFinalizeService = createResumeImportFinalizeService({
  createCv: (input) => cvService.createCv(input),
});
