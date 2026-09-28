import type { CvBuilderFormState } from "@/lib/cv/builder-types";

export type CvDocumentView = CvBuilderFormState & {
  displayName: string;
  displayTitle: string;
  contactItems: string[];
  skillsList: string[];
  isEmpty: boolean;
};

export function buildCvDocumentView(state: CvBuilderFormState): CvDocumentView {
  const skillsList = state.skills.map((skill) => skill.trim()).filter(Boolean);
  const isEmpty =
    !state.personal.fullName &&
    !state.personal.professionalTitle &&
    !state.summary.trim() &&
    state.workExperience.length === 0 &&
    state.education.length === 0 &&
    skillsList.length === 0 &&
    state.projects.length === 0 &&
    state.certifications.length === 0 &&
    state.languages.length === 0 &&
    state.customSections.length === 0;

  return {
    ...state,
    displayName: state.personal.fullName.trim() || "Your Name",
    displayTitle: state.personal.professionalTitle.trim() || "Professional Title",
    contactItems: [
      state.personal.email,
      state.personal.phone,
      state.personal.location,
      state.personal.website,
      state.personal.linkedIn,
    ].filter(Boolean),
    skillsList,
    isEmpty,
  };
}
