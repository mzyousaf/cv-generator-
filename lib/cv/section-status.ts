import type { BuilderNavKey } from "@/lib/cv/builder-section-nav";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import { customSectionIdFromKey, isCustomSectionKey } from "@/lib/cv/section-settings";

export type SectionStatus =
  | { kind: "empty" }
  | { kind: "filled" }
  | { kind: "count"; count: number };

/** How complete a section is, for the mobile section list. */
export function getSectionStatus(key: BuilderNavKey, state: CvBuilderFormState): SectionStatus {
  const count = (n: number): SectionStatus => (n > 0 ? { kind: "count", count: n } : { kind: "empty" });
  const text = (value: string): SectionStatus =>
    value.trim() ? { kind: "filled" } : { kind: "empty" };

  if (isCustomSectionKey(key)) {
    const id = customSectionIdFromKey(key);
    return text(state.customSections.find((entry) => entry.id === id)?.content ?? "");
  }

  switch (key) {
    case "personal":
      return text(
        [state.personal.fullName, state.personal.professionalTitle, state.personal.email].join(""),
      );
    case "summary":
      return text(state.summary);
    case "workExperience":
      return count(state.workExperience.length);
    case "education":
      return count(state.education.length);
    case "skills":
      return count(state.skills.length);
    case "projects":
      return count(state.projects.length);
    case "certifications":
      return count(state.certifications.length);
    case "languages":
      return count(state.languages.length);
    default:
      return { kind: "empty" };
  }
}
