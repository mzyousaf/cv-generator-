import { createEntryId } from "@/lib/cv/builder-mapper";
import {
  createEmptyBuilderState,
  type CvBuilderFormState,
} from "@/lib/cv/builder-types";
import {
  customSectionKey,
  DEFAULT_MANAGEABLE_SECTION_ORDER,
  isManageableSectionId,
  sanitizeSectionSettings,
  type SectionKey,
} from "@/lib/cv/section-settings";
import type { SanitizedResumeImportParse } from "@/lib/resume-import/parse-sanitize";
import { defaultImportResumeTitle } from "@/lib/resume-import/import-title";
import type { Locale } from "@/lib/i18n/preferences";

export function parsedResumeToBuilderState(
  parsed: SanitizedResumeImportParse,
  fallbackLocale?: Locale,
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
  state.customSections = parsed.customSections.map((entry, index) => ({
    id: createEntryId(),
    title: entry.title || `Section ${index + 1}`,
    content: entry.content,
  }));

  // Mirror the document's section order; anything it did not mention follows.
  const order: SectionKey[] = [];
  for (const key of parsed.sectionOrder) {
    if (isManageableSectionId(key)) {
      order.push(key);
      continue;
    }
    const custom = state.customSections[Number(key.slice("custom:".length))];
    if (custom) {
      order.push(customSectionKey(custom.id));
    }
  }
  const remaining: SectionKey[] = [
    ...DEFAULT_MANAGEABLE_SECTION_ORDER,
    ...state.customSections.map((custom) => customSectionKey(custom.id)),
  ];
  for (const key of remaining) {
    if (!order.includes(key)) {
      order.push(key);
    }
  }
  state.sectionSettings = sanitizeSectionSettings({ order, hidden: [] });

  const documentLocale = parsed.documentLanguage ?? fallbackLocale;
  if (documentLocale) {
    state.documentLocale = documentLocale;
  }

  return state;
}
