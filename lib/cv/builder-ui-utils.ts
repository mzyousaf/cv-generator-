import type {
  CertificationEntry,
  EducationEntry,
  LanguageEntry,
  ProjectEntry,
  WorkExperienceEntry,
} from "@/lib/cv/builder-types";
import { getOrderedSectionNavItems } from "@/lib/cv/builder-section-nav";
import {
  isSectionHidden,
  type CvSectionSettings,
  type ManageableSectionId,
} from "@/lib/cv/section-settings";

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

function formatMonthLabel(value: string): string {
  if (!value || !/^\d{4}-\d{2}$/.test(value)) {
    return value.trim();
  }
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function workExperienceEntrySummary(entry: WorkExperienceEntry): {
  title: string;
  subtitle: string;
} {
  const title = entry.jobTitle.trim() || "Untitled role";
  const company = entry.company.trim();
  const start = formatMonthLabel(entry.startDate);
  const end = entry.current
    ? "Present"
    : entry.endDate
      ? formatMonthLabel(entry.endDate)
      : "";
  const datePart = start && end ? `${start} – ${end}` : start || end;
  const subtitle = [company, datePart].filter(Boolean).join(" · ");
  return { title, subtitle: subtitle || "Add company and dates" };
}

export function educationEntrySummary(entry: EducationEntry): {
  title: string;
  subtitle: string;
} {
  const title = entry.degree.trim() || "Degree";
  const subtitle =
    entry.institution.trim() || "Add institution";
  return { title, subtitle };
}

export function projectEntrySummary(entry: ProjectEntry): {
  title: string;
  subtitle: string;
} {
  const title = entry.name.trim() || "Untitled project";
  const subtitle = entry.url.trim() || "Add project details";
  return { title, subtitle };
}

export function certificationEntrySummary(entry: CertificationEntry): {
  title: string;
  subtitle: string;
} {
  const title = entry.name.trim() || "Certification";
  const subtitle = [entry.issuer.trim(), formatMonthLabel(entry.date)]
    .filter(Boolean)
    .join(" · ");
  return { title, subtitle: subtitle || "Add issuer and date" };
}

export function languageEntrySummary(entry: LanguageEntry): {
  title: string;
  subtitle: string;
} {
  const title = entry.language.trim() || "Language";
  const subtitle = entry.proficiency.trim() || "Add proficiency";
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
  sectionId: ManageableSectionId | "personal",
): boolean {
  if (sectionId === "personal") {
    return false;
  }
  return isSectionHidden(settings, sectionId);
}

export function orderedSectionNavIds(settings: CvSectionSettings): string[] {
  return getOrderedSectionNavItems(settings).map((item) => item.id);
}
