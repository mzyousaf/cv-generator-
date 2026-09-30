import { getDefaultAiProvider } from "@/lib/ai/service";
import { createResumeImportParseService } from "@/lib/resume-import/parse-service";

export const resumeImportParseService = createResumeImportParseService({
  getProvider: getDefaultAiProvider,
});
