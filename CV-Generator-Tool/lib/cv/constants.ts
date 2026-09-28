export const DEFAULT_CV_TITLE = "Untitled CV";
export const DEFAULT_CV_TEMPLATE = "default";

export const CV_TITLE_MAX_LENGTH = 200;
export const CV_TEMPLATE_MAX_LENGTH = 50;

/** Allowed CV template identifiers. */
export const CV_TEMPLATE_IDS = ["default", "classic", "modern"] as const;

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
