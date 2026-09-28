import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import { DEFAULT_CV_TEMPLATE } from "@/lib/cv/constants";

export const TEMPLATE_PREVIEW_SAMPLE_STATE: CvBuilderFormState = {
  title: "Sample CV",
  template: DEFAULT_CV_TEMPLATE,
  personal: {
    fullName: "Alex Morgan",
    professionalTitle: "Product Manager",
    email: "alex@example.com",
    phone: "+1 555 0100",
    location: "London, UK",
    website: "",
    linkedIn: "",
  },
  summary: "Experienced product leader focused on clear outcomes.",
  workExperience: [
    {
      id: "sample-work",
      jobTitle: "Senior Product Manager",
      company: "Northwind",
      location: "London",
      startDate: "2021-03",
      endDate: "",
      current: true,
      description: "Led roadmap and cross-functional delivery.",
    },
  ],
  education: [
    {
      id: "sample-edu",
      degree: "BSc Business",
      institution: "City University",
      location: "London",
      startDate: "2014-09",
      endDate: "2018-06",
      description: "",
    },
  ],
  skills: ["Strategy", "Roadmapping", "Stakeholder management"],
  projects: [],
  certifications: [],
  languages: [],
  customSections: [],
};
