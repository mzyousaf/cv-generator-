export type PersonalInfoForm = {
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedIn: string;
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
};

export function createEmptyBuilderState(
  title = "Untitled CV",
  template: CvTemplateId = "default",
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
    },
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
