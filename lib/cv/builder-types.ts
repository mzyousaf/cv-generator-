export type PersonalInfoForm = {
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedIn: string;
  /** Optional details some regional formats expect (Europe, Middle East, Asia). */
  dateOfBirth: string;
  nationality: string;
};

export type WorkExperienceEntry = {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

export type EducationEntry = {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type ProjectEntry = {
  id: string;
  name: string;
  description: string;
  url: string;
};

export type CertificationEntry = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
};

export type LanguageEntry = {
  id: string;
  language: string;
  proficiency: string;
};

export type CustomSectionEntry = {
  id: string;
  title: string;
  content: string;
};

import type { CvTemplateId } from "@/lib/cv/constants";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/preferences";
import {
  createDefaultSectionSettings,
  type CvSectionSettings,
} from "@/lib/cv/section-settings";

export type { CvSectionSettings };

export type CvBuilderFormState = {
  title: string;
  template: CvTemplateId;
  personal: PersonalInfoForm;
  summary: string;
  workExperience: WorkExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  languages: LanguageEntry[];
  customSections: CustomSectionEntry[];
  sectionSettings: CvSectionSettings;
  /** Language of the CV document (headings, dates), independent of the UI language. */
  documentLocale: Locale;
};

export function createEmptyBuilderState(
  title = "Untitled CV",
  template: CvTemplateId = "default",
  documentLocale: Locale = DEFAULT_LOCALE,
): CvBuilderFormState {
  return {
    title,
    template,
    personal: {
      fullName: "",
      professionalTitle: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedIn: "",
      dateOfBirth: "",
      nationality: "",
    },
    summary: "",
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    customSections: [],
    sectionSettings: createDefaultSectionSettings(),
    documentLocale,
  };
}
