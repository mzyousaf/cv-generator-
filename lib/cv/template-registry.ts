import { en } from "@/lib/i18n/dictionaries/en";
import {
  REGIONAL_TEMPLATE_IDS,
  CV_TEMPLATE_IDS,
  DEFAULT_CV_TEMPLATE,
  type CvTemplateId,
} from "@/lib/cv/constants";

export type CvTemplateDefinition = {
  id: CvTemplateId;
  name: string;
  description: string;
};

export const CV_TEMPLATE_REGISTRY: CvTemplateDefinition[] = [
  {
    id: "default",
    name: "Default",
    description: "Balanced layout with clear section headings.",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional single-column CV for corporate roles.",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary layout with a distinct header band.",
  },
  // Regional formats (localized names live in the UI dictionaries).
  ...REGIONAL_TEMPLATE_IDS.map((id) => ({ id, ...en.templateMeta[id] })),
];

export function isCvTemplateId(value: string): value is CvTemplateId {
  return (CV_TEMPLATE_IDS as readonly string[]).includes(value);
}

export function resolveTemplateId(value: string | undefined | null): CvTemplateId {
  if (value && isCvTemplateId(value)) {
    return value;
  }

  return DEFAULT_CV_TEMPLATE;
}

export function getTemplateDefinition(
  templateId: CvTemplateId,
): CvTemplateDefinition {
  return (
    CV_TEMPLATE_REGISTRY.find((template) => template.id === templateId) ??
    CV_TEMPLATE_REGISTRY[0]
  );
}
