import {
  CORE_TEMPLATE_IDS,
  type CoreTemplateId,
  type CvTemplateId,
  type RegionalTemplateId,
} from "@/lib/cv/constants";
import type { Locale } from "@/lib/i18n/preferences";
import { EXTENDED_TEMPLATES } from "@/lib/cv/template-collection";

export const TEMPLATE_REGIONS = [
  "global",
  "europe",
  "uk",
  "dach",
  "france",
  "nordics",
  "southern-europe",
  "benelux",
  "eastern-europe",
  "north-america",
  "latam",
  "middle-east",
  "africa",
  "india",
  "southeast-asia",
  "east-asia",
  "china",
  "oceania",
] as const;

export type TemplateRegion = (typeof TEMPLATE_REGIONS)[number];

/** The country a template is specifically made for, so searching "Poland" ranks the Polish CV first. */
export const TEMPLATE_COUNTRIES: Partial<Record<CvTemplateId, readonly string[]>> = {
  "polish-cv": ["PL"],
  "turkish-cv": ["TR"],
  "swiss-cv": ["CH"],
  "austria-cv": ["AT"],
  "lebenslauf": ["DE"],
  "dach-modern": ["DE"],
  "dutch-cv": ["NL"],
  "belgian-cv": ["BE"],
  "italian-cv": ["IT"],
  "spanish-cv": ["ES"],
  "portuguese-cv": ["PT"],
  "swedish-cv": ["SE"],
  "danish-modern": ["DK"],
  "irish-cv": ["IE"],
  "uk-classic": ["GB"],
  "uk-professional": ["GB"],
  "uk-modern": ["GB"],
  "uk-graduate": ["GB"],
  "cv-francais": ["FR"],
  "cv-moderne": ["FR"],
  "cv-classique": ["FR"],
  "france-elegant": ["FR"],
  "us-resume": ["US"],
  "us-executive": ["US"],
  "us-modern": ["US"],
  "us-tech": ["US"],
  "federal-resume": ["US"],
  "canada-resume": ["CA"],
  "canada-modern": ["CA"],
  "brazil-curriculo": ["BR"],
  "mexico-cv": ["MX"],
  "saudi-cv": ["SA"],
  "uae-modern": ["AE"],
  "egypt-cv": ["EG"],
  "south-africa-cv": ["ZA"],
  "nigeria-cv": ["NG"],
  "kenya-cv": ["KE"],
  "india-resume": ["IN"],
  "india-fresher": ["IN"],
  "india-tech": ["IN"],
  "pakistan-cv": ["PK"],
  "singapore-resume": ["SG"],
  "philippines-resume": ["PH"],
  "malaysia-resume": ["MY"],
  "japan-shokumu": ["JP"],
  "korea-resume": ["KR"],
  "china-jianli": ["CN"],
  "china-modern": ["CN"],
  "china-tech": ["CN"],
  "hong-kong-cv": ["HK"],
  "nz-cv": ["NZ"],
  "australia-resume": ["AU"],
  "australia-modern": ["AU"],
  "cis-cv": ["RU"],
};

/**
 * Countries each region's templates are written for (ISO 3166-1 alpha-2), so
 * the gallery can match a search for a country name in any UI language.
 */
export const REGION_COUNTRIES: Record<TemplateRegion, readonly string[]> = {
  global: [],
  europe: ["EU", "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE"],
  uk: ["GB", "IE"],
  dach: ["DE", "AT", "CH", "LI"],
  france: ["FR", "BE", "LU", "MC", "CH"],
  nordics: ["SE", "NO", "DK", "FI", "IS"],
  "southern-europe": ["IT", "ES", "PT", "GR", "MT", "CY"],
  benelux: ["NL", "BE", "LU"],
  "eastern-europe": ["PL", "CZ", "SK", "HU", "RO", "BG", "HR", "RS", "SI", "EE", "LV", "LT", "UA", "TR", "RU", "BY", "KZ", "UZ", "GE", "AM", "AZ"],
  "north-america": ["US", "CA"],
  latam: ["BR", "MX", "AR", "CL", "CO", "PE", "VE", "EC", "UY", "PY", "BO", "CR", "PA", "DO", "GT"],
  "middle-east": ["SA", "AE", "QA", "KW", "BH", "OM", "JO", "LB", "EG", "MA", "TN", "DZ", "IQ"],
  africa: ["ZA", "NG", "KE", "GH", "UG", "TZ", "ET", "RW", "ZW", "ZM", "BW"],
  india: ["IN", "PK", "BD", "LK", "NP"],
  "southeast-asia": ["SG", "MY", "PH", "ID", "TH", "VN"],
  "east-asia": ["JP", "KR"],
  china: ["CN", "HK", "TW", "MO"],
  oceania: ["AU", "NZ"],
};

/**
 * How a regional template arranges content:
 * - single: one column, entries with dates on the end side
 * - sidebar: coloured side column for contact, details, skills, languages
 * - europass: label column on the start side, content on the end side
 * - timeline: date column on the start side (German Lebenslauf style)
 */
export type TemplateLayout = "single" | "sidebar" | "europass" | "timeline";

export type PhotoPolicy = "expected" | "optional" | "none";

export type TemplateTag = "ats" | "europass" | "two-column" | "personal-details" | "photo" | "letter" | "a4";

export type RegionalTemplateSpec = {
  id: RegionalTemplateId;
  region: TemplateRegion;
  layout: TemplateLayout;
  /** Ink colour for headings, rules and highlights. */
  accent: string;
  /** Side column background for the sidebar layout. */
  sidebarColor?: string;
  /** Which side the sidebar sits on (mirrors in right-to-left documents). Default start. */
  sidebarPosition?: "start" | "end";
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
  /**
   * Photo convention for the region: "expected" (DACH, France, Gulf, Asia,
   * LatAm), "optional", or "none" where photos invite bias concerns (US, UK,
   * Canada, Australia, ATS-oriented formats).
   */
  photo: PhotoPolicy;
  /** "Place, date / Signature" line at the end (DACH convention). */
  signature: boolean;
  /** "References available upon request" line (UK, Australia). */
  referencesNote: boolean;
  pageSize: "A4" | "LETTER";
  compact: boolean;
  tags: TemplateTag[];
};

const BASE_REGIONAL_TEMPLATES: RegionalTemplateSpec[] = [
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
    photo: "optional",
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
    photo: "optional",
    signature: false,
    referencesNote: false,
    pageSize: "A4",
    compact: false,
    tags: ["two-column", "personal-details", "a4"],
  },
  {
    id: "nordic-minimal",
    region: "nordics",
    layout: "single",
    accent: "#475569",
    font: "sans",
    headerAlign: "start",
    heading: "caps",
    summaryLabel: "profile",
    experienceLabel: "workExperience",
    educationLabel: "education",
    personalDetails: false,
    photo: "none",
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
    photo: "none",
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
    photo: "none",
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
    photo: "expected",
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
    photo: "expected",
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
    font: "serif",
    headerAlign: "start",
    heading: "bar",
    summaryLabel: "profile",
    experienceLabel: "professionalExperience",
    educationLabel: "education",
    personalDetails: true,
    photo: "expected",
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
    photo: "optional",
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
    photo: "none",
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
    photo: "none",
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
    photo: "none",
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
    photo: "none",
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
    photo: "expected",
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
    photo: "expected",
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
    photo: "expected",
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
    photo: "expected",
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
    photo: "optional",
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
    photo: "none",
    signature: false,
    referencesNote: true,
    pageSize: "A4",
    compact: true,
    tags: ["ats", "a4"],
  },
  {
    id: "latam-cv",
    region: "latam",
    layout: "sidebar",
    sidebarPosition: "end",
    accent: "#b45309",
    sidebarColor: "#1e3a8a",
    font: "serif",
    headerAlign: "start",
    heading: "caps",
    summaryLabel: "profile",
    experienceLabel: "workExperience",
    educationLabel: "education",
    personalDetails: true,
    photo: "expected",
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
    photo: "optional",
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
    heading: "bar",
    summaryLabel: "profile",
    experienceLabel: "workExperience",
    educationLabel: "education",
    personalDetails: false,
    photo: "none",
    signature: false,
    referencesNote: false,
    pageSize: "A4",
    compact: false,
    tags: ["two-column", "a4"],
  },
];

/** Every regional and role template: the original formats plus the extended collection. */
export const REGIONAL_TEMPLATES: RegionalTemplateSpec[] = [
  ...BASE_REGIONAL_TEMPLATES,
  ...EXTENDED_TEMPLATES,
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
  en: ["north-america", "uk", "oceania", "india", "southeast-asia", "africa", "global"],
  es: ["latam", "southern-europe", "europe", "global"],
  fr: ["france", "benelux", "africa", "europe", "global"],
  de: ["dach", "europe", "global"],
  ar: ["middle-east", "africa", "global"],
  zh: ["china", "east-asia", "global"],
  pt: ["latam", "southern-europe", "africa", "europe", "global"],
  it: ["southern-europe", "europe", "global"],
  nl: ["benelux", "europe", "global"],
  pl: ["eastern-europe", "europe", "global"],
  tr: ["eastern-europe", "middle-east", "europe", "global"],
  ru: ["eastern-europe", "europe", "global"],
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
  pt: "brazil-curriculo",
  it: "italian-cv",
  nl: "dutch-cv",
  pl: "polish-cv",
  tr: "turkish-cv",
  ru: "cis-cv",
};

/** Photo convention for any template id (core templates never show photos). */
export function templatePhotoPolicy(id: CvTemplateId | string): PhotoPolicy {
  return getRegionalTemplateSpec(id)?.photo ?? "none";
}

// ---------------------------------------------------------------------------
// Browsing: style, popularity and filters for the template gallery
// ---------------------------------------------------------------------------

export const TEMPLATE_STYLES = [
  "professional",
  "modern",
  "minimal",
  "classic",
  "creative",
  "executive",
  "academic",
  "simple",
] as const;

export type TemplateStyle = (typeof TEMPLATE_STYLES)[number];

/**
 * Style family and a 1–100 popularity score for every template. Popularity
 * reflects how widely the format is used in its market (ATS-safe one-column
 * layouts and national standards rank highest); it orders "Most popular".
 */
export const TEMPLATE_PROFILE: Record<CvTemplateId, { style: TemplateStyle; popularity: number }> = {
  default: { style: "professional", popularity: 95 },
  classic: { style: "classic", popularity: 89 },
  modern: { style: "modern", popularity: 92 },
  europass: { style: "professional", popularity: 94 },
  "euro-modern": { style: "modern", popularity: 81 },
  "nordic-minimal": { style: "minimal", popularity: 73 },
  "uk-classic": { style: "classic", popularity: 86 },
  "uk-professional": { style: "professional", popularity: 88 },
  lebenslauf: { style: "professional", popularity: 91 },
  "dach-modern": { style: "modern", popularity: 79 },
  "cv-francais": { style: "modern", popularity: 85 },
  "france-elegant": { style: "classic", popularity: 70 },
  "us-resume": { style: "professional", popularity: 93 },
  "ats-plain": { style: "minimal", popularity: 90 },
  "us-executive": { style: "executive", popularity: 82 },
  "canada-resume": { style: "professional", popularity: 78 },
  "gulf-cv": { style: "professional", popularity: 84 },
  "middle-east-executive": { style: "executive", popularity: 74 },
  "china-jianli": { style: "professional", popularity: 83 },
  "china-modern": { style: "modern", popularity: 72 },
  "india-resume": { style: "professional", popularity: 80 },
  "australia-resume": { style: "professional", popularity: 77 },
  "latam-cv": { style: "modern", popularity: 76 },
  "academic-cv": { style: "academic", popularity: 69 },
  "creative-sidebar": { style: "creative", popularity: 75 },
  "minimal-mono": { style: "minimal", popularity: 88 },
  "tech-engineer": { style: "modern", popularity: 90 },
  "startup-bold": { style: "modern", popularity: 78 },
  "elegant-serif": { style: "classic", popularity: 72 },
  "executive-navy": { style: "executive", popularity: 80 },
  "consultant-pro": { style: "professional", popularity: 84 },
  "designer-portfolio": { style: "creative", popularity: 70 },
  "marketing-pop": { style: "creative", popularity: 66 },
  "first-job": { style: "simple", popularity: 82 },
  "healthcare-pro": { style: "professional", popularity: 74 },
  "legal-classic": { style: "classic", popularity: 68 },
  "finance-analyst": { style: "classic", popularity: 73 },
  "sales-impact": { style: "professional", popularity: 69 },
  "teacher-educator": { style: "simple", popularity: 64 },
  "research-scientist": { style: "academic", popularity: 60 },
  "product-manager": { style: "modern", popularity: 79 },
  "data-analyst": { style: "modern", popularity: 77 },
  "hospitality-service": { style: "simple", popularity: 58 },
  "compact-one-page": { style: "minimal", popularity: 86 },
  "two-tone-modern": { style: "modern", popularity: 71 },
  "europass-compact": { style: "professional", popularity: 76 },
  "eu-institutions": { style: "classic", popularity: 62 },
  "nordic-clean": { style: "minimal", popularity: 70 },
  "swedish-cv": { style: "professional", popularity: 63 },
  "danish-modern": { style: "modern", popularity: 61 },
  "italian-cv": { style: "professional", popularity: 67 },
  "spanish-cv": { style: "professional", popularity: 72 },
  "portuguese-cv": { style: "modern", popularity: 60 },
  "dutch-cv": { style: "professional", popularity: 65 },
  "belgian-cv": { style: "classic", popularity: 55 },
  "polish-cv": { style: "professional", popularity: 64 },
  "cee-modern": { style: "modern", popularity: 59 },
  "uk-modern": { style: "modern", popularity: 75 },
  "irish-cv": { style: "professional", popularity: 63 },
  "uk-graduate": { style: "simple", popularity: 68 },
  "swiss-cv": { style: "professional", popularity: 66 },
  "austria-cv": { style: "classic", popularity: 57 },
  "dach-elegant": { style: "modern", popularity: 62 },
  "cv-moderne": { style: "modern", popularity: 63 },
  "cv-classique": { style: "classic", popularity: 58 },
  "us-modern": { style: "modern", popularity: 87 },
  "us-tech": { style: "modern", popularity: 83 },
  "federal-resume": { style: "professional", popularity: 54 },
  "canada-modern": { style: "modern", popularity: 65 },
  "brazil-curriculo": { style: "professional", popularity: 71 },
  "mexico-cv": { style: "modern", popularity: 62 },
  "latam-professional": { style: "professional", popularity: 64 },
  "saudi-cv": { style: "professional", popularity: 66 },
  "uae-modern": { style: "modern", popularity: 68 },
  "egypt-cv": { style: "professional", popularity: 57 },
  "south-africa-cv": { style: "professional", popularity: 61 },
  "nigeria-cv": { style: "professional", popularity: 58 },
  "kenya-cv": { style: "modern", popularity: 55 },
  "india-fresher": { style: "simple", popularity: 74 },
  "india-tech": { style: "modern", popularity: 72 },
  "pakistan-cv": { style: "professional", popularity: 60 },
  "singapore-resume": { style: "professional", popularity: 67 },
  "philippines-resume": { style: "professional", popularity: 63 },
  "malaysia-resume": { style: "modern", popularity: 58 },
  "japan-shokumu": { style: "professional", popularity: 60 },
  "korea-resume": { style: "professional", popularity: 58 },
  "china-tech": { style: "modern", popularity: 66 },
  "hong-kong-cv": { style: "professional", popularity: 59 },
  "nz-cv": { style: "professional", popularity: 62 },
  "australia-modern": { style: "modern", popularity: 64 },
  "turkish-cv": { style: "professional", popularity: 62 },
  "cis-cv": { style: "professional", popularity: 61 },
};

/** Templates at or above this score get a "Popular" badge. */
export const POPULAR_THRESHOLD = 85;

export type TemplateColumns = "one" | "two";

export type TemplateFacets = {
  id: CvTemplateId;
  region: TemplateRegion;
  style: TemplateStyle;
  popularity: number;
  ats: boolean;
  photo: PhotoPolicy;
  columns: TemplateColumns;
};

const CORE_ATS: Record<CoreTemplateId, boolean> = { default: true, classic: true, modern: false };

/** Everything the gallery filters on, for any template id. */
export function templateFacets(id: CvTemplateId): TemplateFacets {
  const spec = getRegionalTemplateSpec(id);
  const profile = TEMPLATE_PROFILE[id];
  return {
    id,
    region: templateRegion(id),
    style: profile.style,
    popularity: profile.popularity,
    ats: spec ? spec.tags.includes("ats") : CORE_ATS[id as CoreTemplateId],
    photo: spec?.photo ?? "none",
    columns: spec && (spec.layout === "sidebar" || spec.layout === "europass") ? "two" : "one",
  };
}

export type TemplateFilter = {
  query?: string;
  region?: TemplateRegion | "all";
  style?: TemplateStyle | "all";
  ats?: boolean;
  photo?: "with" | "without" | "any";
  columns?: TemplateColumns | "any";
};

export type TemplateSort = "popular" | "recommended" | "name";

/** Case-, accent- and dotted/dotless-i-insensitive form used for gallery search. */
export function foldSearchText(text: string, locale: Locale): string {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLocaleLowerCase(locale)
    .replace(/ı/g, "i")
    .replace(/ß/g, "ss")
    .replace(/ł/g, "l")
    .replace(/ø/g, "o")
    .replace(/æ/g, "ae")
    .replace(/đ/g, "d")
    .trim();
}

export type TemplateBrowseOptions = {
  /** UI language: used for names, search and alphabetical sort. */
  locale: Locale;
  /** CV language: drives the "recommended" sort. Defaults to `locale`. */
  recommendFor?: Locale;
  nameOf: (id: CvTemplateId) => string;
  /** Everything a query may match (name, description, region…). Defaults to the name. */
  searchTextOf?: (id: CvTemplateId) => string;
  /** Text whose matches rank first (e.g. name and description). Defaults to the name. */
  primaryTextOf?: (id: CvTemplateId) => string;
};

/**
 * Filter and order the gallery. `nameOf` resolves the translated name so
 * search and A–Z sorting follow the UI language.
 */
export function browseTemplates(
  filter: TemplateFilter,
  sort: TemplateSort,
  { locale, recommendFor = locale, nameOf, searchTextOf = nameOf, primaryTextOf = nameOf }: TemplateBrowseOptions,
  ids: readonly CvTemplateId[],
): CvTemplateId[] {
  const terms = foldSearchText(filter.query ?? "", locale).split(/\s+/).filter(Boolean);
  const matches = ids.filter((id) => {
    const facets = templateFacets(id);
    if (filter.region && filter.region !== "all" && facets.region !== filter.region) return false;
    if (filter.style && filter.style !== "all" && facets.style !== filter.style) return false;
    if (filter.ats && !facets.ats) return false;
    if (filter.photo === "with" && facets.photo === "none") return false;
    if (filter.photo === "without" && facets.photo === "expected") return false;
    if (filter.columns && filter.columns !== "any" && facets.columns !== filter.columns) return false;
    if (terms.length) {
      const haystack = foldSearchText(`${searchTextOf(id)} ${id.replace(/-/g, " ")}`, locale);
      if (!terms.every((term) => haystack.includes(term))) return false;
    }
    return true;
  });

  const sorted = sortTemplates(matches, sort, locale, recommendFor, nameOf);
  if (!terms.length) {
    return sorted;
  }
  // Direct matches come first ("Poland" → Polish CV before the pan-European ones).
  const nameMatches = (id: CvTemplateId) => {
    const primary = foldSearchText(`${primaryTextOf(id)} ${id.replace(/-/g, " ")}`, locale);
    return terms.every((term) => primary.includes(term));
  };
  return [...sorted.filter(nameMatches), ...sorted.filter((id) => !nameMatches(id))];
}

function sortTemplates(
  matches: CvTemplateId[],
  sort: TemplateSort,
  locale: Locale,
  recommendFor: Locale,
  nameOf: (id: CvTemplateId) => string,
): CvTemplateId[] {
  if (sort === "name") {
    return matches.sort((a, b) => nameOf(a).localeCompare(nameOf(b), locale));
  }
  if (sort === "recommended") {
    const regions = REGIONS_FOR_LOCALE[recommendFor];
    const rank = (id: CvTemplateId) => {
      const index = regions.indexOf(templateRegion(id));
      return index === -1 ? regions.length : index;
    };
    return matches.sort(
      (a, b) => rank(a) - rank(b) || TEMPLATE_PROFILE[b].popularity - TEMPLATE_PROFILE[a].popularity,
    );
  }
  return matches.sort((a, b) => TEMPLATE_PROFILE[b].popularity - TEMPLATE_PROFILE[a].popularity);
}
