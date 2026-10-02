import { sanitizePhoto } from "@/lib/cv/photo";
import { resolveDocumentLocale } from "@/lib/cv/builder-mapper";
import { builderStateToContentPatch } from "@/lib/cv/builder-mapper";
import {
  createEmptyBuilderState,
  type CertificationEntry,
  type CvBuilderFormState,
  type EducationEntry,
  type LanguageEntry,
  type PersonalInfoForm,
  type ProjectEntry,
  type WorkExperienceEntry,
} from "@/lib/cv/builder-types";
import { resolveTemplateId } from "@/lib/cv/template-registry";
import {
  validateCreateCvInput,
  type ValidatedCreateCvInput,
} from "@/lib/cv/validation";
import { resolveImportResumeTitle } from "@/lib/resume-import/import-title";
import { sanitizeSectionSettings } from "@/lib/cv/section-settings";
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

const ALLOWED_REVIEW_KEYS = new Set([
  "title",
  "template",
  "personal",
  "summary",
  "workExperience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages",
  "customSections",
  "sectionSettings",
  "documentLocale",
]);

export type ImportPrepareResult =
  | { ok: true; value: ValidatedCreateCvInput }
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

function rejectForbiddenKeys(record: Record<string, unknown>): string | null {
  for (const key of Object.keys(record)) {
    if (FORBIDDEN_KEYS.has(key)) {
      return "Import data contained invalid fields.";
    }
  }

  return null;
}

function sanitizePersonal(value: unknown): PersonalInfoForm {
  const record = isPlainObject(value) ? value : {};

  return {
    fullName: trimString(record.fullName, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    professionalTitle: trimString(
      record.professionalTitle,
      RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH,
    ),
    email: trimString(record.email, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    phone: trimString(record.phone, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    location: trimString(record.location, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    website: trimString(record.website, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    dateOfBirth: trimString(record.dateOfBirth, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    nationality: trimString(record.nationality, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    photo: sanitizePhoto(record.photo),
    linkedIn: trimString(record.linkedIn, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
  };
}

function sanitizeWorkEntry(value: unknown, index: number): WorkExperienceEntry | null {
  const record = isPlainObject(value) ? value : {};
  const entry: WorkExperienceEntry = {
    id: trimString(record.id, 80) || `work-${index}`,
    jobTitle: trimString(record.jobTitle, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    company: trimString(record.company, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    location: trimString(record.location, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    startDate: trimString(record.startDate, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    endDate: trimString(record.endDate, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    current: record.current === true,
    description: trimString(
      record.description,
      RESUME_IMPORT_PARSE_MAX_DESCRIPTION_LENGTH,
    ),
  };

  const hasData = Object.entries(entry).some(([key, field]) => {
    if (key === "id" || key === "current") {
      return field === true;
    }
    return typeof field === "string" && field.length > 0;
  });

  return hasData ? entry : null;
}

function sanitizeEducationEntry(value: unknown, index: number): EducationEntry | null {
  const record = isPlainObject(value) ? value : {};
  const entry: EducationEntry = {
    id: trimString(record.id, 80) || `education-${index}`,
    degree: trimString(record.degree, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    institution: trimString(record.institution, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    location: trimString(record.location, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    startDate: trimString(record.startDate, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    endDate: trimString(record.endDate, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    description: trimString(
      record.description,
      RESUME_IMPORT_PARSE_MAX_DESCRIPTION_LENGTH,
    ),
  };

  const hasData = Object.entries(entry).some(([key, field]) => {
    if (key === "id") {
      return false;
    }
    return typeof field === "string" && field.length > 0;
  });

  return hasData ? entry : null;
}

function sanitizeProjectEntry(value: unknown, index: number): ProjectEntry | null {
  const record = isPlainObject(value) ? value : {};
  const entry: ProjectEntry = {
    id: trimString(record.id, 80) || `project-${index}`,
    name: trimString(record.name, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    description: trimString(
      record.description,
      RESUME_IMPORT_PARSE_MAX_DESCRIPTION_LENGTH,
    ),
    url: trimString(record.url, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
  };

  const hasData = Object.entries(entry).some(([key, field]) => {
    if (key === "id") {
      return false;
    }
    return typeof field === "string" && field.length > 0;
  });

  return hasData ? entry : null;
}

function sanitizeCertificationEntry(
  value: unknown,
  index: number,
): CertificationEntry | null {
  const record = isPlainObject(value) ? value : {};
  const entry: CertificationEntry = {
    id: trimString(record.id, 80) || `cert-${index}`,
    name: trimString(record.name, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    issuer: trimString(record.issuer, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    date: trimString(record.date, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    url: trimString(record.url, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
  };

  const hasData = Object.entries(entry).some(([key, field]) => {
    if (key === "id") {
      return false;
    }
    return typeof field === "string" && field.length > 0;
  });

  return hasData ? entry : null;
}

function sanitizeLanguageEntry(value: unknown, index: number): LanguageEntry | null {
  const record = isPlainObject(value) ? value : {};
  const entry: LanguageEntry = {
    id: trimString(record.id, 80) || `language-${index}`,
    language: trimString(record.language, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
    proficiency: trimString(record.proficiency, RESUME_IMPORT_PARSE_MAX_FIELD_LENGTH),
  };

  return entry.language || entry.proficiency ? entry : null;
}

function sanitizeSkills(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const skills: string[] = [];
  for (const item of value.slice(0, RESUME_IMPORT_PARSE_MAX_SKILLS)) {
    if (typeof item === "string") {
      const trimmed = item.trim().slice(0, RESUME_IMPORT_PARSE_MAX_SKILL_LENGTH);
      if (trimmed) {
        skills.push(trimmed);
      }
    }
  }

  return skills;
}

export function sanitizeImportReviewState(input: unknown): ImportPrepareResult {
  if (!isPlainObject(input)) {
    return { ok: false, message: "Review data is invalid." };
  }

  const forbidden = rejectForbiddenKeys(input);
  if (forbidden) {
    return { ok: false, message: forbidden };
  }

  if ("userId" in input) {
    return { ok: false, message: "Review data is invalid." };
  }

  for (const key of Object.keys(input)) {
    if (!ALLOWED_REVIEW_KEYS.has(key)) {
      return { ok: false, message: "Review data contained unexpected fields." };
    }
  }

  const personal = sanitizePersonal(input.personal);
  const workExperience: WorkExperienceEntry[] = [];
  if (Array.isArray(input.workExperience)) {
    for (const [index, item] of input.workExperience
      .slice(0, RESUME_IMPORT_PARSE_MAX_WORK_ENTRIES)
      .entries()) {
      const entry = sanitizeWorkEntry(item, index);
      if (entry) {
        workExperience.push(entry);
      }
    }
  }

  const education: EducationEntry[] = [];
  if (Array.isArray(input.education)) {
    for (const [index, item] of input.education
      .slice(0, RESUME_IMPORT_PARSE_MAX_EDUCATION_ENTRIES)
      .entries()) {
      const entry = sanitizeEducationEntry(item, index);
      if (entry) {
        education.push(entry);
      }
    }
  }

  const projects: ProjectEntry[] = [];
  if (Array.isArray(input.projects)) {
    for (const [index, item] of input.projects
      .slice(0, RESUME_IMPORT_PARSE_MAX_PROJECTS)
      .entries()) {
      const entry = sanitizeProjectEntry(item, index);
      if (entry) {
        projects.push(entry);
      }
    }
  }

  const certifications: CertificationEntry[] = [];
  if (Array.isArray(input.certifications)) {
    for (const [index, item] of input.certifications
      .slice(0, RESUME_IMPORT_PARSE_MAX_CERTIFICATIONS)
      .entries()) {
      const entry = sanitizeCertificationEntry(item, index);
      if (entry) {
        certifications.push(entry);
      }
    }
  }

  const languages: LanguageEntry[] = [];
  if (Array.isArray(input.languages)) {
    for (const [index, item] of input.languages
      .slice(0, RESUME_IMPORT_PARSE_MAX_LANGUAGES)
      .entries()) {
      const entry = sanitizeLanguageEntry(item, index);
      if (entry) {
        languages.push(entry);
      }
    }
  }

  const title = resolveImportResumeTitle(input.title, personal.fullName);
  const template = resolveTemplateId(
    typeof input.template === "string" ? input.template : "default",
  );

  const builderState: CvBuilderFormState = {
    ...createEmptyBuilderState(title, template),
    title,
    template,
    personal,
    summary: trimString(input.summary, RESUME_IMPORT_PARSE_MAX_SUMMARY_LENGTH),
    workExperience,
    education,
    skills: sanitizeSkills(input.skills),
    projects,
    certifications,
    languages,
    customSections: [],
    sectionSettings: sanitizeSectionSettings(input.sectionSettings),
    documentLocale: resolveDocumentLocale(input.documentLocale),
  };

  return prepareImportForCreate(builderState);
}

export function prepareImportForCreate(
  builderState: CvBuilderFormState,
): ImportPrepareResult {
  const title = resolveImportResumeTitle(
    builderState.title,
    builderState.personal.fullName,
  );
  const template = resolveTemplateId(builderState.template);

  const validated = validateCreateCvInput({
    title,
    template,
    content: builderStateToContentPatch({ ...builderState, title, template }),
  });

  if (!validated.ok) {
    return { ok: false, message: validated.message };
  }

  return { ok: true, value: validated.value };
}
