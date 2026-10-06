import {
  RESUME_IMPORT_PARSE_MAX_CERTIFICATIONS,
  RESUME_IMPORT_PARSE_MAX_CUSTOM_SECTIONS,
  RESUME_IMPORT_PARSE_MAX_SECTION_TITLE_LENGTH,
  RESUME_IMPORT_PARSE_MAX_DESCRIPTION_LENGTH,
  RESUME_IMPORT_PARSE_MAX_EDUCATION_ENTRIES,
  RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH,
  RESUME_IMPORT_PARSE_MAX_LANGUAGES,
  RESUME_IMPORT_PARSE_MAX_PROJECTS,
  RESUME_IMPORT_PARSE_MAX_SKILL_LENGTH,
  RESUME_IMPORT_PARSE_MAX_SKILLS,
  RESUME_IMPORT_PARSE_MAX_SUMMARY_LENGTH,
  RESUME_IMPORT_PARSE_MAX_WORK_ENTRIES,
} from "@/lib/resume-import/parse-constants";
import { LOCALES, type Locale } from "@/lib/i18n/preferences";

const FORBIDDEN_KEYS = new Set(["__proto__", "constructor", "prototype"]);

export type SanitizedResumeImportParse = {
  personal: {
    fullName: string;
    professionalTitle: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedIn: string;
    dateOfBirth: string;
    nationality: string;
  };
  summary: string;
  workExperience: Array<{
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    url: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    url: string;
  }>;
  languages: Array<{
    language: string;
    proficiency: string;
  }>;
  customSections: Array<{
    title: string;
    content: string;
  }>;
  /** Section keys in document order; custom sections as `custom:<index>`. */
  sectionOrder: string[];
  documentLanguage: Locale | null;
};

type SanitizeResult =
  | { ok: true; value: SanitizedResumeImportParse }
  | { ok: false; message: string };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function trimString(value: unknown, maxLength: number): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function isCurrentEndDate(value: string): boolean {
  return /^(present|current|now|ongoing)$/i.test(value.trim());
}

function normalizeWorkDates(entry: {
  startDate: string;
  endDate: string;
  current: boolean;
}): { startDate: string; endDate: string; current: boolean } {
  let { startDate, endDate } = entry;
  const { current } = entry;
  startDate = startDate.trim();
  endDate = endDate.trim();

  if (isCurrentEndDate(endDate)) {
    return { startDate, endDate: "", current: true };
  }

  if (current && endDate) {
    return { startDate, endDate: "", current: true };
  }

  return { startDate, endDate, current: current === true };
}

function readPlainObject(value: unknown): Record<string, unknown> | null {
  if (!isPlainObject(value)) {
    return null;
  }

  const out: Record<string, unknown> = {};
  for (const key of Object.keys(value)) {
    if (FORBIDDEN_KEYS.has(key)) {
      continue;
    }
    out[key] = value[key];
  }

  return out;
}

function dedupeSkills(skills: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const skill of skills) {
    const trimmed = skill.trim();
    if (!trimmed) {
      continue;
    }

    const key = trimmed.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(trimmed.slice(0, RESUME_IMPORT_PARSE_MAX_SKILL_LENGTH));
  }

  return result.slice(0, RESUME_IMPORT_PARSE_MAX_SKILLS);
}

function hasMeaningfulContent(parsed: SanitizedResumeImportParse): boolean {
  const personal = Object.values(parsed.personal).some((value) => value.length > 0);
  if (personal) {
    return true;
  }

  if (parsed.summary.trim().length >= 20) {
    return true;
  }

  if (parsed.workExperience.length > 0) {
    return true;
  }

  if (parsed.education.length > 0) {
    return true;
  }

  if (parsed.skills.length > 0) {
    return true;
  }

  if (parsed.projects.length > 0) {
    return true;
  }

  if (parsed.certifications.length > 0) {
    return true;
  }

  if (parsed.languages.length > 0) {
    return true;
  }

  if (parsed.customSections.length > 0) {
    return true;
  }

  return false;
}

function sanitizePersonal(value: unknown): SanitizedResumeImportParse["personal"] {
  const record = readPlainObject(value) ?? {};

  return {
    fullName: trimString(record.fullName ?? record.name, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    professionalTitle: trimString(
      record.professionalTitle ?? record.title,
      RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH,
    ),
    email: trimString(record.email, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    phone: trimString(record.phone, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    location: trimString(record.location, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    website: trimString(record.website, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    linkedIn: trimString(
      record.linkedIn ?? record.linkedin,
      RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH,
    ),
    dateOfBirth: trimString(record.dateOfBirth, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    nationality: trimString(record.nationality, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
  };
}

function sanitizeWorkExperience(
  value: unknown,
): SanitizedResumeImportParse["workExperience"] {
  if (!Array.isArray(value)) {
    return [];
  }

  const entries: SanitizedResumeImportParse["workExperience"] = [];

  for (const item of value.slice(0, RESUME_IMPORT_PARSE_MAX_WORK_ENTRIES)) {
    const record = readPlainObject(item);
    if (!record) {
      continue;
    }

    const dates = normalizeWorkDates({
      startDate: trimString(record.startDate, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
      endDate: trimString(record.endDate, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
      current: record.current === true,
    });

    const entry = {
      jobTitle: trimString(record.jobTitle ?? record.title, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
      company: trimString(record.company, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
      location: trimString(record.location, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
      ...dates,
      description: trimString(
        record.description,
        RESUME_IMPORT_PARSE_MAX_DESCRIPTION_LENGTH,
      ),
    };

    const hasData = Object.values(entry).some((field) =>
      typeof field === "string" ? field.length > 0 : field === true,
    );

    if (hasData) {
      entries.push(entry);
    }
  }

  return entries;
}

function sanitizeEducation(value: unknown): SanitizedResumeImportParse["education"] {
  if (!Array.isArray(value)) {
    return [];
  }

  const entries: SanitizedResumeImportParse["education"] = [];

  for (const item of value.slice(0, RESUME_IMPORT_PARSE_MAX_EDUCATION_ENTRIES)) {
    const record = readPlainObject(item);
    if (!record) {
      continue;
    }

    const entry = {
      degree: trimString(record.degree, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
      institution: trimString(
        record.institution ?? record.school,
        RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH,
      ),
      location: trimString(record.location, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
      startDate: trimString(record.startDate, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
      endDate: trimString(record.endDate, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
      description: trimString(
        record.description,
        RESUME_IMPORT_PARSE_MAX_DESCRIPTION_LENGTH,
      ),
    };

    const hasData = Object.values(entry).some((field) => field.length > 0);
    if (hasData) {
      entries.push(entry);
    }
  }

  return entries;
}

function sanitizeSkills(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const skills: string[] = [];
  for (const item of value) {
    if (typeof item === "string") {
      skills.push(item);
      continue;
    }

    const record = readPlainObject(item);
    if (record && typeof record.name === "string") {
      skills.push(record.name);
    }
  }

  return dedupeSkills(skills);
}

function sanitizeProjects(value: unknown): SanitizedResumeImportParse["projects"] {
  if (!Array.isArray(value)) {
    return [];
  }

  const entries: SanitizedResumeImportParse["projects"] = [];

  for (const item of value.slice(0, RESUME_IMPORT_PARSE_MAX_PROJECTS)) {
    const record = readPlainObject(item);
    if (!record) {
      continue;
    }

    const entry = {
      name: trimString(record.name ?? record.projectName, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
      description: trimString(
        record.description,
        RESUME_IMPORT_PARSE_MAX_DESCRIPTION_LENGTH,
      ),
      url: trimString(record.url, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    };

    if (Object.values(entry).some((field) => field.length > 0)) {
      entries.push(entry);
    }
  }

  return entries;
}

function sanitizeCertifications(
  value: unknown,
): SanitizedResumeImportParse["certifications"] {
  if (!Array.isArray(value)) {
    return [];
  }

  const entries: SanitizedResumeImportParse["certifications"] = [];

  for (const item of value.slice(0, RESUME_IMPORT_PARSE_MAX_CERTIFICATIONS)) {
    const record = readPlainObject(item);
    if (!record) {
      continue;
    }

    const entry = {
      name: trimString(record.name, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
      issuer: trimString(record.issuer, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
      date: trimString(record.date, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
      url: trimString(record.url, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    };

    if (Object.values(entry).some((field) => field.length > 0)) {
      entries.push(entry);
    }
  }

  return entries;
}

function sanitizeLanguages(value: unknown): SanitizedResumeImportParse["languages"] {
  if (!Array.isArray(value)) {
    return [];
  }

  const entries: SanitizedResumeImportParse["languages"] = [];

  for (const item of value.slice(0, RESUME_IMPORT_PARSE_MAX_LANGUAGES)) {
    const record = readPlainObject(item);
    if (!record) {
      continue;
    }

    const entry = {
      language: trimString(record.language ?? record.name, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
      proficiency: trimString(record.proficiency, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    };

    if (entry.language || entry.proficiency) {
      entries.push(entry);
    }
  }

  return entries;
}

/** Accepts plain strings or {title, content}; keeps sections that have text. */
function sanitizeCustomSections(value: unknown): {
  entries: SanitizedResumeImportParse["customSections"];
  /** Model's array index -> index in `entries` (empty sections are dropped). */
  indexMap: Map<number, number>;
} {
  const entries: SanitizedResumeImportParse["customSections"] = [];
  const indexMap = new Map<number, number>();
  if (!Array.isArray(value)) {
    return { entries, indexMap };
  }

  for (const [index, item] of value.slice(0, RESUME_IMPORT_PARSE_MAX_CUSTOM_SECTIONS).entries()) {
    const record = readPlainObject(item);
    if (!record) {
      continue;
    }

    const rawContent = Array.isArray(record.content)
      ? record.content.filter((line) => typeof line === "string").join("\n")
      : record.content ?? record.text ?? record.items;
    const entry = {
      title: trimString(record.title ?? record.heading, RESUME_IMPORT_PARSE_MAX_SECTION_TITLE_LENGTH),
      content: trimString(rawContent, RESUME_IMPORT_PARSE_MAX_DESCRIPTION_LENGTH),
    };

    if (entry.content) {
      indexMap.set(index, entries.length);
      entries.push(entry);
    }
  }

  return { entries, indexMap };
}

const ORDERABLE_KEYS = new Set([
  "summary",
  "workExperience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages",
]);

function sanitizeSectionOrder(value: unknown, customIndexMap: Map<number, number>): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of value.slice(0, 60)) {
    if (typeof item !== "string") {
      continue;
    }
    let key = item.trim();
    const customMatch = /^custom:(\d{1,3})$/.exec(key);
    if (customMatch) {
      const mapped = customIndexMap.get(Number(customMatch[1]));
      key = mapped === undefined ? "" : `custom:${mapped}`;
    }
    const valid = ORDERABLE_KEYS.has(key) || key.startsWith("custom:");
    if (valid && !seen.has(key)) {
      seen.add(key);
      result.push(key);
    }
  }
  return result;
}

function sanitizeDocumentLanguage(value: unknown): Locale | null {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value)
    ? (value as Locale)
    : null;
}

function rejectForbiddenKeys(value: Record<string, unknown>): SanitizeResult | null {
  for (const key of Object.keys(value)) {
    if (FORBIDDEN_KEYS.has(key)) {
      return {
        ok: false,
        message: "Parsed resume data contained invalid fields.",
      };
    }
  }

  return null;
}

export function sanitizeParsedResumeImport(
  input: unknown,
): SanitizeResult {
  if (!isPlainObject(input)) {
    return { ok: false, message: "Parsed resume data was not a valid object." };
  }

  const forbidden = rejectForbiddenKeys(input);
  if (forbidden) {
    return forbidden;
  }

  const root = readPlainObject(input);
  if (!root) {
    return { ok: false, message: "Parsed resume data was not a valid object." };
  }

  const parsed: SanitizedResumeImportParse = {
    personal: sanitizePersonal(root.personal),
    summary: trimString(root.summary, RESUME_IMPORT_PARSE_MAX_SUMMARY_LENGTH),
    workExperience: sanitizeWorkExperience(root.workExperience),
    education: sanitizeEducation(root.education),
    skills: sanitizeSkills(root.skills),
    projects: sanitizeProjects(root.projects),
    certifications: sanitizeCertifications(root.certifications),
    languages: sanitizeLanguages(root.languages),
    customSections: [],
    sectionOrder: [],
    documentLanguage: sanitizeDocumentLanguage(root.documentLanguage),
  };
  const custom = sanitizeCustomSections(root.customSections);
  parsed.customSections = custom.entries;
  parsed.sectionOrder = sanitizeSectionOrder(root.sectionOrder, custom.indexMap);

  if (!hasMeaningfulContent(parsed)) {
    return {
      ok: false,
      message: "We could not find enough resume information to review. Try another file.",
    };
  }

  return { ok: true, value: parsed };
}
