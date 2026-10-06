import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import { AI_MAX_CONTEXT_LENGTH } from "@/lib/ai/section-writer";

/** Compact plain-text view of a CV so AI section writing stays grounded in it. */
export function buildAiCvContext(state: CvBuilderFormState): string {
  const lines: string[] = [];
  const { personal } = state;
  const push = (label: string, value: string) => {
    if (value.trim()) {
      lines.push(`${label}: ${value.trim()}`);
    }
  };

  push("Name", personal.fullName);
  push("Title", personal.professionalTitle);
  push("Location", personal.location);
  push("Summary", state.summary.slice(0, 1200));

  const roles = state.workExperience
    .map((entry) =>
      [entry.jobTitle, entry.company && `at ${entry.company}`, entry.startDate && `(${entry.startDate}${entry.current ? "–present" : entry.endDate ? `–${entry.endDate}` : ""})`]
        .filter(Boolean)
        .join(" "),
    )
    .filter(Boolean);
  push("Experience", roles.join("; "));

  const education = state.education
    .map((entry) => [entry.degree, entry.institution && `at ${entry.institution}`].filter(Boolean).join(" "))
    .filter(Boolean);
  push("Education", education.join("; "));

  push("Skills", state.skills.join(", "));
  push("Projects", state.projects.map((entry) => entry.name).filter(Boolean).join(", "));
  push("Certifications", state.certifications.map((entry) => entry.name).filter(Boolean).join(", "));
  push("Languages", state.languages.map((entry) => entry.language).filter(Boolean).join(", "));
  push(
    "Other sections",
    state.customSections.map((entry) => entry.title).filter(Boolean).join(", "),
  );

  return lines.join("\n").slice(0, AI_MAX_CONTEXT_LENGTH);
}
