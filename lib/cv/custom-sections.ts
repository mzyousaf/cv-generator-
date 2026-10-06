import { createEntryId } from "@/lib/cv/builder-mapper";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import {
  addCustomSectionToSettings,
  removeCustomSectionFromSettings,
} from "@/lib/cv/section-settings";

/** Appends a custom section (also to the section order) and returns its id. */
export function addCustomSection(
  state: CvBuilderFormState,
  section: { title: string; content: string },
): { state: CvBuilderFormState; id: string } {
  const id = createEntryId();
  const customSections = [...state.customSections, { id, ...section }];
  return {
    id,
    state: {
      ...state,
      customSections,
      sectionSettings: addCustomSectionToSettings(state.sectionSettings, id, customSections),
    },
  };
}

export function removeCustomSection(state: CvBuilderFormState, id: string): CvBuilderFormState {
  return {
    ...state,
    customSections: state.customSections.filter((entry) => entry.id !== id),
    sectionSettings: removeCustomSectionFromSettings(state.sectionSettings, id),
  };
}
