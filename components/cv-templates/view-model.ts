import type {
  CertificationEntry,
  CvBuilderFormState,
  EducationEntry,
  WorkExperienceEntry,
} from "@/lib/cv/builder-types";
import {
  CV_DATE_LOCALE,
  CV_DOCUMENT_LABELS,
  type CvDocumentLabels,
} from "@/lib/cv/document-labels";
import {
  createDefaultSectionSettings,
  getVisibleSectionOrder,
  type ManageableSectionId,
} from "@/lib/cv/section-settings";
import { localeDirection, type Locale } from "@/lib/i18n/preferences";
import { formatDateRange, formatMonth } from "@/components/cv-templates/utils/format-dates";

type Dated = { dates: string };

export type CvDocumentView = Omit<
  CvBuilderFormState,
  "workExperience" | "education" | "certifications"
> & {
  workExperience: (WorkExperienceEntry & Dated)[];
  education: (EducationEntry & Dated)[];
  certifications: (CertificationEntry & Dated)[];
  locale: Locale;
  dir: "ltr" | "rtl";
  labels: CvDocumentLabels;
  displayName: string;
  displayTitle: string;
  contactItems: string[];
  /** Date of birth / nationality rows for formats that show personal details. */
  personalDetails: { label: string; value: string }[];
  skillsList: string[];
  isEmpty: boolean;
  visibleSectionOrder: ManageableSectionId[];
};

export function buildCvDocumentView(state: CvBuilderFormState): CvDocumentView {
  const locale = state.documentLocale ?? "en";
  const labels = CV_DOCUMENT_LABELS[locale];
  const dateFormat = { locale: CV_DATE_LOCALE[locale], present: labels.present };
  const skillsList = state.skills.map((skill) => skill.trim()).filter(Boolean);
  const isEmpty =
    !state.personal.fullName &&
    !state.personal.professionalTitle &&
    !state.summary.trim() &&
    state.workExperience.length === 0 &&
    state.education.length === 0 &&
    skillsList.length === 0 &&
    state.projects.length === 0 &&
    state.certifications.length === 0 &&
    state.languages.length === 0 &&
    state.customSections.length === 0;

  const sectionSettings = state.sectionSettings ?? createDefaultSectionSettings();
  const personal = state.personal;

  return {
    ...state,
    locale,
    dir: localeDirection(locale),
    labels,
    sectionSettings,
    visibleSectionOrder: getVisibleSectionOrder(sectionSettings),
    displayName: personal.fullName.trim() || labels.yourName,
    displayTitle: personal.professionalTitle.trim() || labels.professionalTitle,
    contactItems: [
      personal.email,
      personal.phone,
      personal.location,
      personal.website,
      personal.linkedIn,
    ].filter(Boolean),
    personalDetails: [
      { label: labels.dateOfBirth, value: (personal.dateOfBirth ?? "").trim() },
      { label: labels.nationality, value: (personal.nationality ?? "").trim() },
    ].filter((item) => item.value),
    workExperience: state.workExperience.map((entry) => ({
      ...entry,
      jobTitle: entry.jobTitle || labels.jobTitle,
      dates: formatDateRange(entry.startDate, entry.endDate, entry.current, dateFormat),
    })),
    education: state.education.map((entry) => ({
      ...entry,
      degree: entry.degree || labels.degree,
      dates: formatDateRange(entry.startDate, entry.endDate, false, dateFormat),
    })),
    projects: state.projects.map((entry) => ({
      ...entry,
      name: entry.name || labels.project,
    })),
    certifications: state.certifications.map((entry) => ({
      ...entry,
      name: entry.name || labels.certification,
      dates: formatMonth(entry.date, dateFormat),
    })),
    languages: state.languages.map((entry) => ({
      ...entry,
      language: entry.language || labels.language,
    })),
    customSections: state.customSections.map((entry) => ({
      ...entry,
      title: entry.title || labels.customSection,
    })),
    skillsList,
    isEmpty,
  };
}
