import { createEntryId } from "@/lib/cv/builder-mapper";
import {
  createEmptyBuilderState,
  type CvBuilderFormState,
} from "@/lib/cv/builder-types";
import type { SanitizedResumeImportParse } from "@/lib/resume-import/parse-sanitize";
import { defaultImportResumeTitle } from "@/lib/resume-import/import-title";

export function parsedResumeToBuilderState(
  parsed: SanitizedResumeImportParse,
): CvBuilderFormState {
  const state = createEmptyBuilderState(defaultImportResumeTitle(parsed.personal.fullName));

  state.personal = { ...state.personal, ...parsed.personal };
  state.summary = parsed.summary;
  state.workExperience = parsed.workExperience.map((entry) => ({
    id: createEntryId(),
    ...entry,
  }));
  state.education = parsed.education.map((entry) => ({
    id: createEntryId(),
    ...entry,
  }));
  state.skills = [...parsed.skills];
  state.projects = parsed.projects.map((entry) => ({
    id: createEntryId(),
    ...entry,
  }));
  state.certifications = parsed.certifications.map((entry) => ({
    id: createEntryId(),
    ...entry,
  }));
  state.languages = parsed.languages.map((entry) => ({
    id: createEntryId(),
    ...entry,
  }));

  return state;
}
