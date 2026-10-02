import {
  CORE_TEMPLATE_IDS,
  type CoreTemplateId,
  type CvTemplateId,
  type RegionalTemplateId,
} from "@/lib/cv/constants";
import type { Locale } from "@/lib/i18n/preferences";

export const TEMPLATE_REGIONS = [
  "global",
  "europe",
  "uk",
  "dach",
  "france",
  "north-america",
  "latam",
  "middle-east",
  "india",
  "china",
  "oceania",
] as const;

export type TemplateRegion = (typeof TEMPLATE_REGIONS)[number];

/**
 * How a regional template arranges content:
 * - single: one column, entries with dates on the end side
 * - sidebar: coloured side column for contact, details, skills, languages
 * - europass: label column on the start side, content on the end side
 * - timeline: date column on the start side (German Lebenslauf style)
 */
export type TemplateLayout = "single" | "sidebar" | "europass" | "timeline";

export type TemplateTag = "ats" | "europass" | "two-column" | "personal-details" | "letter" | "a4";

export type RegionalTemplateSpec = {
  id: RegionalTemplateId;
  region: TemplateRegion;
  layout: TemplateLayout;
  /** Ink colour for headings, rules and highlights. */
  accent: string;
  /** Side column background for the sidebar layout. */
  sidebarColor?: string;
  /** Dark header band behind name and contact details. */
  headerBand?: string;
  font: "sans" | "serif";
  headerAlign: "start" | "center";
  heading: "rule" | "accent-rule" | "caps" | "block" | "bar";
  summaryLabel: "summary" | "profile" | "objective";
  experienceLabel: "workExperience" | "professionalExperience";
  educationLabel: "education" | "educationTraining";
  /** Show date of birth and nationality when filled in. */
  personalDetails: boolean;
  /** "Place, date / Signature" line at the end (DACH convention). */
  signature: boolean;
  /** "References available upon request" line (UK, Australia). */
  referencesNote: boolean;
  pageSize: "A4" | "LETTER";
  compact: boolean;
  tags: TemplateTag[];
};

export const REGIONAL_TEMPLATES: RegionalTemplateSpec[] = [
  {
    id: "europass",
    region: "europe",
    layout: "europass",
    accent: "#0e4194",
    font: "sans",
    headerAlign: "start",
    heading: "accent-rule",
    summaryLabel: "profile",
    experienceLabel: "workExperience",
    educationLabel: "educationTraining",
    personalDetails: true,
    signature: false,
    referencesNote: false,
    pageSize: "A4",
    compact: false,
    tags: ["europass", "personal-details", "a4"],
  },
  {
    id: "euro-modern",
    region: "europe",
    layout: "sidebar",
    accent: "#0d9488",
    sidebarColor: "#0f3b4c",
    font: "sans",
    headerAlign: "start",
    heading: "caps",
    summaryLabel: "profile",
    experienceLabel: "workExperience",
    educationLabel: "education",
    personalDetails: true,
    signature: false,
    referencesNote: false,
    pageSize: "A4",
    compact: false,
    tags: ["two-column", "personal-details", "a4"],
  },
  {
    id: "nordic-minimal",
    region: "europe",
    layout: "single",
    accent: "#475569",
    font: "sans",
    headerAlign: "start",
    heading: "caps",
    summaryLabel: "profile",
    experienceLabel: "workExperience",
    educationLabel: "education",
    personalDetails: false,
    signature: false,
    referencesNote: false,
    pageSize: "A4",
    compact: false,
    tags: ["ats", "a4"],
  },
  {
    id: "uk-classic",
    region: "uk",
    layout: "single",
    accent: "#1f2937",
    font: "serif",
    headerAlign: "center",
    heading: "rule",
    summaryLabel: "profile",
    experienceLabel: "workExperience",
    educationLabel: "education",
    personalDetails: false,
    signature: false,
    referencesNote: true,
    pageSize: "A4",
    compact: false,
    tags: ["ats", "a4"],
  },
  {
    id: "uk-professional",
    region: "uk",
    layout: "single",
    accent: "#1d4ed8",
    font: "sans",
    headerAlign: "start",
    heading: "accent-rule",
    summaryLabel: "profile",
    experienceLabel: "professionalExperience",
    educationLabel: "education",
    personalDetails: false,
    signature: false,
    referencesNote: true,
    pageSize: "A4",
    compact: false,
    tags: ["ats", "a4"],
  },
  {
    id: "lebenslauf",
    region: "dach",
    layout: "timeline",
    accent: "#1e3a5f",
    font: "sans",
    headerAlign: "start",
    heading: "accent-rule",
    summaryLabel: "profile",
    experienceLabel: "professionalExperience",
    educationLabel: "educationTraining",
    personalDetails: true,
    signature: true,
    referencesNote: false,
    pageSize: "A4",
    compact: false,
    tags: ["personal-details", "a4"],
  },
  {
    id: "dach-modern",
    region: "dach",
    layout: "timeline",
    accent: "#334155",
    headerBand: "#1e293b",
    font: "sans",
    headerAlign: "start",
    heading: "caps",
    summaryLabel: "profile",
    experienceLabel: "professionalExperience",
    educationLabel: "education",
    personalDetails: true,
    signature: true,
    referencesNote: false,
    pageSize: "A4",
    compact: false,
    tags: ["personal-details", "a4"],
  },
  {
    id: "cv-francais",
    region: "france",
    layout: "sidebar",
    accent: "#2563eb",
    sidebarColor: "#1e2a4a",
    font: "sans",
    headerAlign: "start",
    heading: "caps",
    summaryLabel: "profile",
    experienceLabel: "professionalExperience",
    educationLabel: "education",
    personalDetails: true,
    signature: false,
    referencesNote: false,
    pageSize: "A4",
    compact: false,
    tags: ["two-column", "personal-details", "a4"],
  },
  {
    id: "france-elegant",
    region: "france",
    layout: "single",
    accent: "#7c2d12",
    font: "serif",
    headerAlign: "center",
    heading: "rule",
    summaryLabel: "profile",
    experienceLabel: "professionalExperience",
    educationLabel: "education",
    personalDetails: false,
    signature: false,
    referencesNote: false,
    pageSize: "A4",
    compact: false,
    tags: ["a4"],
  },
  {
    id: "us-resume",
    region: "north-america",
    layout: "single",
    accent: "#111827",
    font: "sans",
    headerAlign: "center",
    heading: "rule",
    summaryLabel: "summary",
    experienceLabel: "professionalExperience",
    educationLabel: "education",
    personalDetails: false,
    signature: false,
    referencesNote: false,
    pageSize: "LETTER",
    compact: true,
    tags: ["ats", "letter"],
  },
  {
    id: "ats-plain",
    region: "north-america",
    layout: "single",
    accent: "#000000",
    font: "sans",
    headerAlign: "start",
    heading: "caps",
    summaryLabel: "summary",
    experienceLabel: "workExperience",
    educationLabel: "education",
    personalDetails: false,
    signature: false,
    referencesNote: false,
    pageSize: "LETTER",
    compact: true,
    tags: ["ats", "letter"],
  },
  {
    id: "us-executive",
    region: "north-america",
    layout: "single",
    accent: "#7f1d1d",
    font: "serif",
    headerAlign: "center",
    heading: "accent-rule",
    summaryLabel: "summary",
    experienceLabel: "professionalExperience",
    educationLabel: "education",
    personalDetails: false,
    signature: false,
    referencesNote: false,
    pageSize: "LETTER",
    compact: false,
    tags: ["ats", "letter"],
  },
  {
    id: "canada-resume",
    region: "north-america",
    layout: "single",
    accent: "#b91c1c",
    font: "sans",
    headerAlign: "start",
    heading: "bar",
    summaryLabel: "profile",
    experienceLabel: "workExperience",
    educationLabel: "education",
    personalDetails: false,
    signature: false,
    referencesNote: false,
    pageSize: "LETTER",
    compact: false,
    tags: ["ats", "letter"],
  },
  {
    id: "gulf-cv",
    region: "middle-east",
    layout: "sidebar",
    accent: "#a67c3d",
    sidebarColor: "#0f3d3e",
    font: "sans",
    headerAlign: "start",
    heading: "accent-rule",
    summaryLabel: "objective",
    experienceLabel: "workExperience",
    educationLabel: "education",
    personalDetails: true,
    signature: false,
    referencesNote: false,
    pageSize: "A4",
    compact: false,
    tags: ["two-column", "personal-details", "a4"],
  },
  {
    id: "middle-east-executive",
    region: "middle-east",
    layout: "single",
    accent: "#a67c3d",
    headerBand: "#111827",
    font: "sans",
    headerAlign: "start",
    heading: "accent-rule",
    summaryLabel: "summary",
    experienceLabel: "professionalExperience",
    educationLabel: "education",
    personalDetails: true,
    signature: false,
    referencesNote: false,
    pageSize: "A4",
    compact: false,
    tags: ["personal-details", "a4"],
  },
  {
    id: "china-jianli",
    region: "china",
    layout: "single",
    accent: "#1e40af",
    font: "sans",
    headerAlign: "start",
    heading: "block",
    summaryLabel: "profile",
    experienceLabel: "workExperience",
    educationLabel: "education",
    personalDetails: true,
    signature: false,
    referencesNote: false,
    pageSize: "A4",
    compact: true,
    tags: ["personal-details", "a4"],
  },
  {
    id: "china-modern",
    region: "china",
    layout: "sidebar",
    accent: "#dc2626",
    sidebarColor: "#3f1d1d",
    font: "sans",
    headerAlign: "start",
    heading: "bar",
    summaryLabel: "profile",
    experienceLabel: "workExperience",
    educationLabel: "education",
    personalDetails: true,
    signature: false,
    referencesNote: false,
    pageSize: "A4",
    compact: false,
    tags: ["two-column", "personal-details", "a4"],
  },
  {
    id: "india-resume",
    region: "india",
    layout: "single",
    accent: "#1e3a8a",
    font: "sans",
    headerAlign: "start",
    heading: "block",
    summaryLabel: "objective",
    experienceLabel: "professionalExperience",
    educationLabel: "education",
    personalDetails: true,
    signature: false,
    referencesNote: false,
    pageSize: "A4",
    compact: false,
    tags: ["ats", "personal-details", "a4"],
  },
  {
    id: "australia-resume",
    region: "oceania",
    layout: "single",
    accent: "#0f766e",
    font: "sans",
    headerAlign: "start",
    heading: "accent-rule",
    summaryLabel: "objective",
    experienceLabel: "workExperience",
    educationLabel: "education",
    personalDetails: false,
    signature: false,
    referencesNote: true,
    pageSize: "A4",
    compact: false,
    tags: ["ats", "a4"],
  },
  {
    id: "latam-cv",
    region: "latam",
    layout: "sidebar",
    accent: "#f59e0b",
    sidebarColor: "#1e3a8a",
    font: "sans",
    headerAlign: "start",
    heading: "caps",
    summaryLabel: "profile",
    experienceLabel: "workExperience",
    educationLabel: "education",
    personalDetails: true,
    signature: false,
    referencesNote: false,
    pageSize: "A4",
    compact: false,
    tags: ["two-column", "personal-details", "a4"],
  },
  {
    id: "academic-cv",
    region: "global",
    layout: "timeline",
    accent: "#334155",
    font: "serif",
    headerAlign: "center",
    heading: "rule",
    summaryLabel: "profile",
    experienceLabel: "professionalExperience",
    educationLabel: "education",
    personalDetails: false,
    signature: false,
    referencesNote: false,
    pageSize: "A4",
    compact: false,
    tags: ["a4"],
  },
  {
    id: "creative-sidebar",
    region: "global",
    layout: "sidebar",
    accent: "#8b5cf6",
    sidebarColor: "#2e1065",
    font: "sans",
    headerAlign: "start",
    heading: "caps",
    summaryLabel: "profile",
    experienceLabel: "workExperience",
    educationLabel: "education",
    personalDetails: false,
    signature: false,
    referencesNote: false,
    pageSize: "A4",
    compact: false,
    tags: ["two-column", "a4"],
  },
];

const SPEC_BY_ID = new Map(REGIONAL_TEMPLATES.map((spec) => [spec.id, spec]));

export function getRegionalTemplateSpec(
  id: CvTemplateId | string,
): RegionalTemplateSpec | undefined {
  return SPEC_BY_ID.get(id as RegionalTemplateId);
}

export function isCoreTemplateId(id: string): id is CoreTemplateId {
  return (CORE_TEMPLATE_IDS as readonly string[]).includes(id);
}

/** Region shown for a template in the picker (core templates are global). */
export function templateRegion(id: CvTemplateId): TemplateRegion {
  return getRegionalTemplateSpec(id)?.region ?? "global";
}

/** Regions whose conventions suit a given language, most relevant first. */
export const REGIONS_FOR_LOCALE: Record<Locale, TemplateRegion[]> = {
  en: ["north-america", "uk", "oceania", "india", "global"],
  es: ["latam", "europe", "global"],
  fr: ["france", "europe", "global"],
  de: ["dach", "europe", "global"],
  ar: ["middle-east", "global"],
  zh: ["china", "global"],
};

/** Templates recommended for a language, ordered by region relevance. */
export function recommendedTemplateIds(locale: Locale): CvTemplateId[] {
  const regions = REGIONS_FOR_LOCALE[locale];
  return regions.flatMap((region) =>
    REGIONAL_TEMPLATES.filter((spec) => spec.region === region).map(
      (spec) => spec.id as CvTemplateId,
    ),
  );
}

/** Title colour on a dark header band: keep light accents (gold), lighten dark ones. */
export function bandTitleColor(accent: string): string {
  const value = Number.parseInt(accent.slice(1), 16);
  const luminance =
    0.2126 * ((value >> 16) & 255) + 0.7152 * ((value >> 8) & 255) + 0.0722 * (value & 255);
  return luminance > 110 ? accent : "#cbd5e1";
}

/** Starting template for a new CV, matching the conventions of the user's language. */
export const DEFAULT_TEMPLATE_FOR_LOCALE: Record<Locale, CvTemplateId> = {
  en: "default",
  es: "europass",
  fr: "cv-francais",
  de: "lebenslauf",
  ar: "gulf-cv",
  zh: "china-jianli",
};
