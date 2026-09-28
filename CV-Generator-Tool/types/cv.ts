import type { Types } from "mongoose";

/** Flexible section payloads; shape is refined in the CV builder later. */
export type CVSectionValue = Record<string, unknown> | string | unknown[];

export type CVContent = {
  personal?: CVSectionValue;
  summary?: string;
  workExperience?: CVSectionValue[];
  education?: CVSectionValue[];
  skills?: CVSectionValue[];
  projects?: CVSectionValue[];
  certifications?: CVSectionValue[];
  languages?: CVSectionValue[];
  customSections?: CVSectionValue[];
  /** Additional section keys without schema migrations (MongoDB strict: false). */
  [sectionKey: string]: unknown;
};

export type CVDocumentFields = {
  userId: Types.ObjectId;
  title: string;
  template: string;
  content: CVContent;
  createdAt: Date;
  updatedAt: Date;
};
