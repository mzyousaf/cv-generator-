import {
  RESUME_IMPORT_PARSE_MAX_CERTIFICATIONS,
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
  };

  if (!hasMeaningfulContent(parsed)) {
    return {
      ok: false,
      message: "We could not find enough resume information to review. Try another file.",
    };
  }

  return { ok: true, value: parsed };
}
