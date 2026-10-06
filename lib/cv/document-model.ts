import type { CvDocumentLabels } from "@/lib/cv/document-labels";
import { isCustomSectionKey, type ManageableSectionId } from "@/lib/cv/section-settings";
import { findCustomSection, type CvDocumentView } from "@/components/cv-templates/view-model";
import { sanitizePhoto } from "@/lib/cv/photo";
import type { RegionalTemplateSpec } from "@/lib/cv/template-catalog";

export type DocItem = {
  title: string;
  subtitle: string;
  dates: string;
  body: string;
};

export type DocPair = { label: string; value: string };

export type DocBlock =
  | { kind: "text"; text: string }
  | { kind: "items"; items: DocItem[] }
  | { kind: "tags"; tags: string[] }
  | { kind: "pairs"; pairs: DocPair[] };

export type DocSection = {
  key: string;
  title: string;
  block: DocBlock;
  /** Where the sidebar layout places the section. */
  placement: "main" | "side";
};

/**
 * Layout-independent description of a CV for the regional templates.
 * The HTML preview and the PDF renderer both draw from this, so they match.
 */
export type RegionalDocumentModel = {
  spec: RegionalTemplateSpec;
  labels: CvDocumentLabels;
  dir: "ltr" | "rtl";
  /** Arabic and CJK must not be letter-spaced or upper-cased. */
  script: "latin" | "arabic" | "cjk";
  isEmpty: boolean;
  name: string;
  title: string;
  /** Contact lines with labels (email, phone, address, website, LinkedIn). */
  contacts: DocPair[];
  /** Date of birth / nationality, only when the spec shows personal details. */
  details: DocPair[];
  /** Photo data URL when the format shows photos and one is set; otherwise "". */
  photo: string;
  sections: DocSection[];
};

const SIDE_SECTIONS: ReadonlySet<ManageableSectionId> = new Set([
  "skills",
  "languages",
  "certifications",
]);

function sectionTitle(
  id: ManageableSectionId,
  labels: CvDocumentLabels,
  spec: RegionalTemplateSpec,
): string {
  switch (id) {
    case "summary":
      return labels[spec.summaryLabel];
    case "workExperience":
      return labels[spec.experienceLabel];
    case "education":
      return labels[spec.educationLabel];
    default:
      return labels[id];
  }
}

function sectionBlock(id: ManageableSectionId, view: CvDocumentView): DocBlock | null {
  const join = (...parts: string[]) => parts.filter(Boolean).join(" · ");

  switch (id) {
    case "summary":
      return view.summary.trim() ? { kind: "text", text: view.summary.trim() } : null;
    case "workExperience":
      return view.workExperience.length
        ? {
            kind: "items",
            items: view.workExperience.map((entry) => ({
              title: entry.jobTitle,
              subtitle: join(entry.company, entry.location),
              dates: entry.dates,
              body: entry.description.trim(),
            })),
          }
        : null;
    case "education":
      return view.education.length
        ? {
            kind: "items",
            items: view.education.map((entry) => ({
              title: entry.degree,
              subtitle: join(entry.institution, entry.location),
              dates: entry.dates,
              body: entry.description.trim(),
            })),
          }
        : null;
    case "skills":
      return view.skillsList.length ? { kind: "tags", tags: view.skillsList } : null;
    case "projects":
      return view.projects.length
        ? {
            kind: "items",
            items: view.projects.map((entry) => ({
              title: entry.name,
              subtitle: entry.url,
              dates: "",
              body: entry.description.trim(),
            })),
          }
        : null;
    case "certifications":
      return view.certifications.length
        ? {
            kind: "items",
            items: view.certifications.map((entry) => ({
              title: entry.name,
              subtitle: entry.issuer,
              dates: entry.dates,
              body: "",
            })),
          }
        : null;
    case "languages":
      return view.languages.length
        ? {
            kind: "pairs",
            pairs: view.languages.map((entry) => ({
              label: entry.language,
              value: entry.proficiency,
            })),
          }
        : null;
    default:
      return null;
  }
}

export function buildRegionalDocumentModel(
  view: CvDocumentView,
  spec: RegionalTemplateSpec,
): RegionalDocumentModel {
  const { labels, personal } = view;
  const sideCapable = spec.layout === "sidebar";

  const sections: DocSection[] = [];
  for (const id of view.visibleSectionOrder) {
    if (isCustomSectionKey(id)) {
      const custom = findCustomSection(view, id);
      if (custom) {
        sections.push({
          key: id,
          title: custom.title,
          block: { kind: "text", text: custom.content.trim() },
          placement: "main",
        });
      }
      continue;
    }
    const block = sectionBlock(id, view);
    if (block) {
      sections.push({
        key: id,
        title: sectionTitle(id, labels, spec),
        block,
        placement: sideCapable && SIDE_SECTIONS.has(id) ? "side" : "main",
      });
    }
  }
  const contacts: DocPair[] = [
    { label: labels.email, value: personal.email },
    { label: labels.phone, value: personal.phone },
    { label: labels.address, value: personal.location },
    { label: labels.website, value: personal.website },
    { label: labels.linkedin, value: personal.linkedIn },
  ].filter((pair) => pair.value.trim());

  return {
    spec,
    labels,
    dir: view.dir,
    script: view.locale === "ar" ? "arabic" : view.locale === "zh" ? "cjk" : "latin",
    isEmpty: view.isEmpty,
    name: view.displayName,
    title: view.displayTitle,
    contacts,
    details: spec.personalDetails ? view.personalDetails : [],
    photo: spec.photo === "none" ? "" : sanitizePhoto(personal.photo),
    sections,
  };
}
