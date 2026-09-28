import { resolveTemplateId } from "@/lib/cv/template-registry";
import type { CVContent } from "@/types/cv";
import {
  createEmptyBuilderState,
  type CertificationEntry,
  type CustomSectionEntry,
  type CvBuilderFormState,
  type EducationEntry,
  type LanguageEntry,
  type ProjectEntry,
  type WorkExperienceEntry,
} from "@/lib/cv/builder-types";

export function createEntryId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `entry-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asBoolean(value: unknown): boolean {
  return value === true;
}

function mapWorkEntry(raw: unknown, index: number): WorkExperienceEntry {
  const record =
    typeof raw === "object" && raw !== null
      ? (raw as Record<string, unknown>)
      : {};

  return {
    id: asString(record.id) || `work-${index}`,
    jobTitle: asString(record.jobTitle ?? record.title),
    company: asString(record.company),
    location: asString(record.location),
    startDate: asString(record.startDate),
    endDate: asString(record.endDate),
    current: asBoolean(record.current),
    description: asString(record.description),
  };
}

function mapEducationEntry(raw: unknown, index: number): EducationEntry {
  const record =
    typeof raw === "object" && raw !== null
      ? (raw as Record<string, unknown>)
      : {};

  return {
    id: asString(record.id) || `education-${index}`,
    degree: asString(record.degree),
    institution: asString(record.institution ?? record.school),
    location: asString(record.location),
    startDate: asString(record.startDate),
    endDate: asString(record.endDate),
    description: asString(record.description),
  };
}

function mapProjectEntry(raw: unknown, index: number): ProjectEntry {
  const record =
    typeof raw === "object" && raw !== null
      ? (raw as Record<string, unknown>)
      : {};

  return {
    id: asString(record.id) || `project-${index}`,
    name: asString(record.name ?? record.projectName),
    description: asString(record.description),
    url: asString(record.url),
  };
}

function mapCertificationEntry(raw: unknown, index: number): CertificationEntry {
  const record =
    typeof raw === "object" && raw !== null
      ? (raw as Record<string, unknown>)
      : {};

  return {
    id: asString(record.id) || `cert-${index}`,
    name: asString(record.name),
    issuer: asString(record.issuer),
    date: asString(record.date),
    url: asString(record.url),
  };
}

function mapLanguageEntry(raw: unknown, index: number): LanguageEntry {
  const record =
    typeof raw === "object" && raw !== null
      ? (raw as Record<string, unknown>)
      : {};

  return {
    id: asString(record.id) || `language-${index}`,
    language: asString(record.language ?? record.name),
    proficiency: asString(record.proficiency),
  };
}

function mapCustomSectionEntry(raw: unknown, index: number): CustomSectionEntry {
  const record =
    typeof raw === "object" && raw !== null
      ? (raw as Record<string, unknown>)
      : {};

  return {
    id: asString(record.id) || `custom-${index}`,
    title: asString(record.title),
    content: asString(record.content ?? record.entries),
  };
}

export function cvRecordToBuilderState(
  title: string,
  content: CVContent,
  template?: string,
): CvBuilderFormState {
  const base = createEmptyBuilderState(title, resolveTemplateId(template));
  const personalRaw =
    typeof content.personal === "object" &&
    content.personal !== null &&
    !Array.isArray(content.personal)
      ? (content.personal as Record<string, unknown>)
      : {};

  base.personal = {
    fullName: asString(personalRaw.fullName ?? personalRaw.name),
    professionalTitle: asString(
      personalRaw.professionalTitle ?? personalRaw.title,
    ),
    email: asString(personalRaw.email),
    phone: asString(personalRaw.phone),
    location: asString(personalRaw.location),
    website: asString(personalRaw.website),
    linkedIn: asString(personalRaw.linkedIn ?? personalRaw.linkedin),
  };

  base.summary = asString(content.summary);
  base.workExperience = (content.workExperience ?? []).map(mapWorkEntry);
  base.education = (content.education ?? []).map(mapEducationEntry);
  base.skills = (content.skills ?? [])
    .map((item) => {
      if (typeof item === "string") {
        return item;
      }
      if (typeof item === "object" && item !== null && !Array.isArray(item)) {
        return asString((item as Record<string, unknown>).name);
      }
      return "";
    })
    .filter(Boolean);
  base.projects = (content.projects ?? []).map(mapProjectEntry);
  base.certifications = (content.certifications ?? []).map(mapCertificationEntry);
  base.languages = (content.languages ?? []).map(mapLanguageEntry);
  base.customSections = (content.customSections ?? []).map(mapCustomSectionEntry);

  return base;
}

export function builderStateToContentPatch(
  state: CvBuilderFormState,
): Record<string, unknown> {
  return {
    personal: { ...state.personal },
    summary: state.summary,
    workExperience: state.workExperience.map(
      ({ id, jobTitle, company, location, startDate, endDate, current, description }) => ({
        id,
        jobTitle,
        company,
        location,
        startDate,
        endDate: current ? "" : endDate,
        current,
        description,
      }),
    ),
    education: state.education.map(
      ({ id, degree, institution, location, startDate, endDate, description }) => ({
        id,
        degree,
        institution,
        location,
        startDate,
        endDate,
        description,
      }),
    ),
    skills: state.skills.map((skill) => ({ name: skill })),
    projects: state.projects.map(({ id, name, description, url }) => ({
      id,
      name,
      description,
      url,
    })),
    certifications: state.certifications.map(({ id, name, issuer, date, url }) => ({
      id,
      name,
      issuer,
      date,
      url,
    })),
    languages: state.languages.map(({ id, language, proficiency }) => ({
      id,
      language,
      proficiency,
    })),
    customSections: state.customSections.map(({ id, title, content }) => ({
      id,
      title,
      content,
    })),
  };
}

export function serializeBuilderState(state: CvBuilderFormState): string {
  return JSON.stringify(state);
}
