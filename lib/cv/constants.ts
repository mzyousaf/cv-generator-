export const DEFAULT_CV_TITLE = "Untitled CV";
export const DEFAULT_CV_TEMPLATE = "default";

export const CV_TITLE_MAX_LENGTH = 200;
export const CV_TEMPLATE_MAX_LENGTH = 50;

/** Original layouts with bespoke renderers (also used on the landing page). */
export const CORE_TEMPLATE_IDS = ["default", "classic", "modern"] as const;

/** Regional formats rendered by the shared catalog renderer. */
export const REGIONAL_TEMPLATE_IDS = [
  "europass",
  "euro-modern",
  "nordic-minimal",
  "uk-classic",
  "uk-professional",
  "lebenslauf",
  "dach-modern",
  "cv-francais",
  "france-elegant",
  "us-resume",
  "ats-plain",
  "us-executive",
  "canada-resume",
  "gulf-cv",
  "middle-east-executive",
  "china-jianli",
  "china-modern",
  "india-resume",
  "australia-resume",
  "latam-cv",
  "academic-cv",
  "creative-sidebar",
  "minimal-mono",
  "tech-engineer",
  "startup-bold",
  "elegant-serif",
  "executive-navy",
  "consultant-pro",
  "designer-portfolio",
  "marketing-pop",
  "first-job",
  "healthcare-pro",
  "legal-classic",
  "finance-analyst",
  "sales-impact",
  "teacher-educator",
  "research-scientist",
  "product-manager",
  "data-analyst",
  "hospitality-service",
  "compact-one-page",
  "two-tone-modern",
  "europass-compact",
  "eu-institutions",
  "nordic-clean",
  "swedish-cv",
  "danish-modern",
  "italian-cv",
  "spanish-cv",
  "portuguese-cv",
  "dutch-cv",
  "belgian-cv",
  "polish-cv",
  "cee-modern",
  "uk-modern",
  "irish-cv",
  "uk-graduate",
  "swiss-cv",
  "austria-cv",
  "dach-elegant",
  "cv-moderne",
  "cv-classique",
  "us-modern",
  "us-tech",
  "federal-resume",
  "canada-modern",
  "brazil-curriculo",
  "mexico-cv",
  "latam-professional",
  "saudi-cv",
  "uae-modern",
  "egypt-cv",
  "south-africa-cv",
  "nigeria-cv",
  "kenya-cv",
  "india-fresher",
  "india-tech",
  "pakistan-cv",
  "singapore-resume",
  "philippines-resume",
  "malaysia-resume",
  "japan-shokumu",
  "korea-resume",
  "china-tech",
  "hong-kong-cv",
  "nz-cv",
  "australia-modern",
  "turkish-cv",
  "cis-cv",
] as const;

/** Allowed CV template identifiers. */
export const CV_TEMPLATE_IDS = [...CORE_TEMPLATE_IDS, ...REGIONAL_TEMPLATE_IDS] as const;

export type CoreTemplateId = (typeof CORE_TEMPLATE_IDS)[number];
export type RegionalTemplateId = (typeof REGIONAL_TEMPLATE_IDS)[number];

export type CvTemplateId = (typeof CV_TEMPLATE_IDS)[number];

export const CV_CONTENT_MAX_BYTES = 512_000;

export const CV_ARRAY_SECTION_KEYS = [
  "workExperience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages",
  "customSections",
] as const;
