import type {
  CertificationEntry,
  EducationEntry,
  LanguageEntry,
  ProjectEntry,
  WorkExperienceEntry,
  CvBuilderFormState,
} from "@/lib/cv/builder-types";
import { getOrderedSectionKeys, type BuilderNavKey } from "@/lib/cv/builder-section-nav";
import { isSectionHidden, type CvSectionSettings } from "@/lib/cv/section-settings";

export type BuilderMobilePane = "edit" | "preview";

export const PREVIEW_ZOOM_LEVELS = [50, 75, 100] as const;
export type PreviewZoomLevel = (typeof PREVIEW_ZOOM_LEVELS)[number];

export const DEFAULT_PREVIEW_ZOOM: PreviewZoomLevel = 75;

export function clampPreviewZoom(value: number): PreviewZoomLevel {
  if (value <= PREVIEW_ZOOM_LEVELS[0]) {
    return PREVIEW_ZOOM_LEVELS[0];
  }
  if (value >= PREVIEW_ZOOM_LEVELS[PREVIEW_ZOOM_LEVELS.length - 1]) {
    return PREVIEW_ZOOM_LEVELS[PREVIEW_ZOOM_LEVELS.length - 1];
  }
  let closest: PreviewZoomLevel = PREVIEW_ZOOM_LEVELS[0];
  let minDistance = Math.abs(value - closest);
  for (const level of PREVIEW_ZOOM_LEVELS) {
    const distance = Math.abs(value - level);
    if (distance < minDistance) {
      minDistance = distance;
      closest = level;
    }
  }
  return closest;
}

export function stepPreviewZoom(
  current: PreviewZoomLevel,
  direction: "in" | "out",
): PreviewZoomLevel {
  const index = PREVIEW_ZOOM_LEVELS.indexOf(current);
  if (direction === "in") {
    return PREVIEW_ZOOM_LEVELS[Math.min(index + 1, PREVIEW_ZOOM_LEVELS.length - 1)];
  }
  return PREVIEW_ZOOM_LEVELS[Math.max(index - 1, 0)];
}

export function isValidBuilderMobilePane(value: string): value is BuilderMobilePane {
  return value === "edit" || value === "preview";
}

function formatMonthLabel(value: string, locale = "en-US"): string {
  if (!value || !/^\d{4}-\d{2}$/.test(value)) {
    return value.trim();
  }
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString(locale, { month: "short", year: "numeric" });
}

export type EntrySummaryLabels = {
  locale: string;
  untitledRole: string;
  present: string;
  addCompanyDates: string;
  degree: string;
  addInstitution: string;
  untitledProject: string;
  addProjectDetails: string;
  certification: string;
  addIssuerDate: string;
  language: string;
  addProficiency: string;
};

export const DEFAULT_ENTRY_SUMMARY_LABELS: EntrySummaryLabels = {
  locale: "en-US",
  untitledRole: "Untitled role",
  present: "Present",
  addCompanyDates: "Add company and dates",
  degree: "Degree",
  addInstitution: "Add institution",
  untitledProject: "Untitled project",
  addProjectDetails: "Add project details",
  certification: "Certification",
  addIssuerDate: "Add issuer and date",
  language: "Language",
  addProficiency: "Add proficiency",
};

export function workExperienceEntrySummary(
  entry: WorkExperienceEntry,
  labels: EntrySummaryLabels = DEFAULT_ENTRY_SUMMARY_LABELS,
): {
  title: string;
  subtitle: string;
} {
  const title = entry.jobTitle.trim() || labels.untitledRole;
  const company = entry.company.trim();
  const start = formatMonthLabel(entry.startDate, labels.locale);
  const end = entry.current
    ? labels.present
    : entry.endDate
      ? formatMonthLabel(entry.endDate, labels.locale)
      : "";
  const datePart = start && end ? `${start} – ${end}` : start || end;
  const subtitle = [company, datePart].filter(Boolean).join(" · ");
  return { title, subtitle: subtitle || labels.addCompanyDates };
}

export function educationEntrySummary(
  entry: EducationEntry,
  labels: EntrySummaryLabels = DEFAULT_ENTRY_SUMMARY_LABELS,
): {
  title: string;
  subtitle: string;
} {
  const title = entry.degree.trim() || labels.degree;
  const subtitle =
    entry.institution.trim() || labels.addInstitution;
  return { title, subtitle };
}

export function projectEntrySummary(
  entry: ProjectEntry,
  labels: EntrySummaryLabels = DEFAULT_ENTRY_SUMMARY_LABELS,
): {
  title: string;
  subtitle: string;
} {
  const title = entry.name.trim() || labels.untitledProject;
  const subtitle = entry.url.trim() || labels.addProjectDetails;
  return { title, subtitle };
}

export function certificationEntrySummary(
  entry: CertificationEntry,
  labels: EntrySummaryLabels = DEFAULT_ENTRY_SUMMARY_LABELS,
): {
  title: string;
  subtitle: string;
} {
  const title = entry.name.trim() || labels.certification;
  const subtitle = [entry.issuer.trim(), formatMonthLabel(entry.date, labels.locale)]
    .filter(Boolean)
    .join(" · ");
  return { title, subtitle: subtitle || labels.addIssuerDate };
}

export function languageEntrySummary(
  entry: LanguageEntry,
  labels: EntrySummaryLabels = DEFAULT_ENTRY_SUMMARY_LABELS,
): {
  title: string;
  subtitle: string;
} {
  const title = entry.language.trim() || labels.language;
  const subtitle = entry.proficiency.trim() || labels.addProficiency;
  return { title, subtitle };
}

export function normalizeSkillsList(skills: string[]): string[] {
  const result: string[] = [];
  const seen = new Set<string>();

  for (const raw of skills) {
    const trimmed = raw.trim();
    if (!trimmed) {
      continue;
    }
    const key = trimmed.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(trimmed);
  }

  return result;
}

export function addSkillToList(skills: string[], skill: string): string[] {
  const trimmed = skill.trim();
  if (!trimmed) {
    return normalizeSkillsList(skills);
  }
  return normalizeSkillsList([...normalizeSkillsList(skills), trimmed]);
}

export function removeSkillFromList(skills: string[], index: number): string[] {
  return normalizeSkillsList(skills.filter((_, i) => i !== index));
}

export function sectionNavHiddenState(
  settings: CvSectionSettings,
  sectionId: BuilderNavKey,
): boolean {
  if (sectionId === "personal") {
    return false;
  }
  return isSectionHidden(settings, sectionId);
}

export function orderedSectionNavIds(
  settings: CvSectionSettings,
  customSections: CvBuilderFormState["customSections"] = [],
): string[] {
  return getOrderedSectionKeys({ sectionSettings: settings, customSections });
}
