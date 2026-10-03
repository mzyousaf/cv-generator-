import { isValidPhotoDataUrl } from "@/lib/cv/photo";
import { LOCALES } from "@/lib/i18n/preferences";
import {
  CV_ARRAY_SECTION_KEYS,
  CV_CONTENT_MAX_BYTES,
  CV_TEMPLATE_IDS,
  CV_TEMPLATE_MAX_LENGTH,
  CV_TITLE_MAX_LENGTH,
  DEFAULT_CV_TEMPLATE,
  DEFAULT_CV_TITLE,
  type CvTemplateId,
} from "@/lib/cv/constants";
import {
  sanitizeSectionSettings,
  sectionSettingsToStored,
} from "@/lib/cv/section-settings";
import type { CVContent, CVSectionValue } from "@/types/cv";

export type ValidatedCreateCvInput = {
  title: string;
  template: CvTemplateId;
  content: CVContent;
};

export type ValidatedUpdateCvInput = {
  title?: string;
  template?: CvTemplateId;
  contentPatch?: Record<string, unknown>;
};

type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; message: string };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function validateSummary(value: unknown): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error("Summary must be a string.");
  }

  if (value.length > 10_000) {
    throw new Error("Summary is too long.");
  }

  return value;
}

function validateSectionArray(
  value: unknown,
  field: string,
): CVSectionValue[] {
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new Error(`${field} must be an array.`);
  }

  if (value.length > 200) {
    throw new Error(`${field} has too many entries.`);
  }

  for (const item of value) {
    if (
      item !== null &&
      typeof item !== "object" &&
      typeof item !== "string" &&
      typeof item !== "number" &&
      typeof item !== "boolean"
    ) {
      throw new Error(`${field} contains invalid entries.`);
    }
  }

  return value as CVSectionValue[];
}

function validatePersonal(value: unknown): Record<string, unknown> | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!isPlainObject(value)) {
    throw new Error("Personal information must be an object.");
  }

  if (value.photo !== undefined && value.photo !== "" && !isValidPhotoDataUrl(value.photo)) {
    throw new Error("Photo must be a JPEG or PNG image under 240 KB.");
  }

  return value;
}

export function createEmptyCvContent(): CVContent {
  return {
    personal: {},
    summary: "",
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    customSections: [],
  };
}

function buildContentFromInput(
  input: Record<string, unknown>,
  base: CVContent,
): CVContent {
  const content: CVContent = { ...base };

  if ("personal" in input) {
    content.personal = validatePersonal(input.personal) ?? {};
  }

  if ("summary" in input) {
    content.summary = validateSummary(input.summary) ?? "";
  }

  for (const key of CV_ARRAY_SECTION_KEYS) {
    if (key in input) {
      content[key] = validateSectionArray(input[key], key);
    }
  }

  if ("documentLocale" in input) {
    if (!(LOCALES as readonly unknown[]).includes(input.documentLocale)) {
      throw new Error("Unsupported CV language.");
    }
    content.documentLocale = input.documentLocale;
  }

  if ("sectionSettings" in input) {
    content.sectionSettings = sectionSettingsToStored(
      sanitizeSectionSettings(input.sectionSettings),
    );
  }

  for (const [key, value] of Object.entries(input)) {
    if (
      key === "personal" ||
      key === "summary" ||
      key === "sectionSettings" ||
      key === "documentLocale" ||
      (CV_ARRAY_SECTION_KEYS as readonly string[]).includes(key)
    ) {
      continue;
    }

    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      throw new Error("Invalid content field.");
    }

    content[key] = value;
  }

  return content;
}

export function sanitizeCvContent(input: unknown): ValidationResult<CVContent> {
  if (input === undefined) {
    return { ok: true, value: createEmptyCvContent() };
  }

  if (!isPlainObject(input)) {
    return { ok: false, message: "CV content must be an object." };
  }

  try {
    const content = buildContentFromInput(input, createEmptyCvContent());
    const serialized = JSON.stringify(content);
    if (serialized.length > CV_CONTENT_MAX_BYTES) {
      return { ok: false, message: "CV content is too large." };
    }

    return { ok: true, value: content };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Invalid CV content shape.",
    };
  }
}

export function sanitizeCvContentPatch(
  input: unknown,
  existing: CVContent,
): ValidationResult<CVContent> {
  if (!isPlainObject(input)) {
    return { ok: false, message: "CV content must be an object." };
  }

  try {
    const content = buildContentFromInput(input, existing);
    const serialized = JSON.stringify(content);
    if (serialized.length > CV_CONTENT_MAX_BYTES) {
      return { ok: false, message: "CV content is too large." };
    }

    return { ok: true, value: content };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Invalid CV content shape.",
    };
  }
}

function validateTitle(value: unknown, fallback: string): ValidationResult<string> {
  const title = typeof value === "string" ? value.trim() : fallback;

  if (!title) {
    return { ok: false, message: "Title is required." };
  }

  if (title.length > CV_TITLE_MAX_LENGTH) {
    return { ok: false, message: "Title is too long." };
  }

  return { ok: true, value: title };
}

function validateTemplate(value: unknown): ValidationResult<CvTemplateId> {
  const template =
    typeof value === "string" ? value.trim() : DEFAULT_CV_TEMPLATE;

  if (!template || template.length > CV_TEMPLATE_MAX_LENGTH) {
    return { ok: false, message: "Template is invalid." };
  }

  if (!(CV_TEMPLATE_IDS as readonly string[]).includes(template)) {
    return { ok: false, message: "Template is not supported." };
  }

  return { ok: true, value: template as CvTemplateId };
}

export function validateCreateCvInput(input: {
  title?: unknown;
  template?: unknown;
  content?: unknown;
}): ValidationResult<ValidatedCreateCvInput> {
  const titleResult = validateTitle(input.title, DEFAULT_CV_TITLE);
  if (!titleResult.ok) {
    return titleResult;
  }

  const templateResult = validateTemplate(input.template);
  if (!templateResult.ok) {
    return templateResult;
  }

  const contentResult = sanitizeCvContent(input.content);
  if (!contentResult.ok) {
    return contentResult;
  }

  return {
    ok: true,
    value: {
      title: titleResult.value,
      template: templateResult.value,
      content: contentResult.value,
    },
  };
}

export function validateUpdateCvInput(input: {
  title?: unknown;
  template?: unknown;
  content?: unknown;
}): ValidationResult<ValidatedUpdateCvInput> {
  const result: ValidatedUpdateCvInput = {};

  if ("title" in input) {
    const titleResult = validateTitle(input.title, "");
    if (!titleResult.ok) {
      return titleResult;
    }
    result.title = titleResult.value;
  }

  if ("template" in input) {
    const templateResult = validateTemplate(input.template);
    if (!templateResult.ok) {
      return templateResult;
    }
    result.template = templateResult.value;
  }

  if ("content" in input) {
    if (!isPlainObject(input.content)) {
      return { ok: false, message: "CV content must be an object." };
    }
    result.contentPatch = input.content;
  }

  if (
    result.title === undefined &&
    result.template === undefined &&
    result.contentPatch === undefined
  ) {
    return { ok: false, message: "No valid fields to update." };
  }

  return { ok: true, value: result };
}

export function isValidCvId(cvId: string): boolean {
  return /^[a-f\d]{24}$/i.test(cvId);
}
