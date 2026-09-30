import type { ReactNode } from "react";
import {
  CertificationsList,
  CvSection,
  EducationList,
  LanguagesList,
  ProjectsList,
  SkillsBlock,
  SummaryBlock,
  WorkExperienceList,
} from "@/components/cv-templates/primitives/shared-sections";
import type { CvDocumentView } from "@/components/cv-templates/view-model";
import type { ManageableSectionId } from "@/lib/cv/section-settings";

export type HtmlTemplateVariant = "default" | "classic" | "modern";

type VariantStyles = {
  sectionHeading: string;
  sectionBody: string;
  summary: string;
  workTitle: string;
  workMeta: string;
  workBody: string;
  workDate: string;
  eduTitle: string;
  eduMeta: string;
  eduBody: string;
  eduDate: string;
  skills: string;
  projectTitle: string;
  projectUrl: string;
  projectBody: string;
  certTitle: string;
  certMeta: string;
  certUrl: string;
  langRow: string;
  langName: string;
  langLevel: string;
};

const VARIANT_STYLES: Record<HtmlTemplateVariant, VariantStyles> = {
  default: {
    sectionHeading:
      "border-b border-zinc-300 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-700",
    sectionBody: "mt-5",
    summary: "text-[11px] leading-relaxed text-zinc-800",
    workTitle: "text-[12px] font-semibold text-zinc-900",
    workMeta: "text-[11px] text-zinc-700",
    workBody: "text-[11px] leading-relaxed text-zinc-800",
    workDate: "shrink-0 text-[10px] text-zinc-600",
    eduTitle: "text-[12px] font-semibold text-zinc-900",
    eduMeta: "text-[11px] text-zinc-700",
    eduBody: "text-[11px] leading-relaxed text-zinc-800",
    eduDate: "shrink-0 text-[10px] text-zinc-600",
    skills: "text-[11px] leading-relaxed text-zinc-800",
    projectTitle: "text-[12px] font-semibold text-zinc-900",
    projectUrl: "text-[10px] text-zinc-600",
    projectBody: "text-[11px] leading-relaxed text-zinc-800",
    certTitle: "text-[12px] font-semibold text-zinc-900",
    certMeta: "text-[11px] text-zinc-700",
    certUrl: "text-[10px] text-zinc-600",
    langRow: "flex justify-between gap-4 text-[11px]",
    langName: "font-medium text-zinc-900",
    langLevel: "text-zinc-700",
  },
  classic: {
    sectionHeading:
      "border-b-2 border-zinc-800 pb-1 text-[12px] font-bold uppercase tracking-[0.12em] text-zinc-900",
    sectionBody: "mt-6",
    summary: "text-[12px] leading-[1.65] text-zinc-800",
    workTitle: "text-[13px] font-bold text-zinc-900",
    workMeta: "text-[11px] text-zinc-700",
    workBody: "text-[12px] leading-[1.65] text-zinc-800",
    workDate: "shrink-0 text-[10px] text-zinc-600",
    eduTitle: "text-[13px] font-bold text-zinc-900",
    eduMeta: "text-[11px] text-zinc-700",
    eduBody: "text-[12px] leading-[1.65] text-zinc-800",
    eduDate: "shrink-0 text-[10px] text-zinc-600",
    skills: "text-[12px] leading-[1.65] text-zinc-800",
    projectTitle: "text-[13px] font-bold text-zinc-900",
    projectUrl: "text-[10px] text-zinc-600",
    projectBody: "text-[12px] leading-[1.65] text-zinc-800",
    certTitle: "text-[13px] font-bold text-zinc-900",
    certMeta: "text-[11px] text-zinc-700",
    certUrl: "text-[10px] text-zinc-600",
    langRow: "flex justify-between gap-4 text-[12px]",
    langName: "font-bold text-zinc-900",
    langLevel: "text-zinc-700",
  },
  modern: {
    sectionHeading:
      "text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500",
    sectionBody: "mt-6",
    summary: "text-[11px] leading-relaxed text-slate-800",
    workTitle: "text-[12px] font-semibold text-slate-900",
    workMeta: "text-[11px] text-slate-600",
    workBody: "text-[11px] leading-relaxed text-slate-700",
    workDate: "shrink-0 text-[10px] text-slate-500",
    eduTitle: "text-[12px] font-semibold text-slate-900",
    eduMeta: "text-[11px] text-slate-600",
    eduBody: "text-[11px] leading-relaxed text-slate-700",
    eduDate: "shrink-0 text-[10px] text-slate-500",
    skills: "text-[11px] leading-relaxed text-slate-700",
    projectTitle: "text-[12px] font-semibold text-slate-900",
    projectUrl: "text-[10px] text-slate-500",
    projectBody: "text-[11px] leading-relaxed text-slate-700",
    certTitle: "text-[12px] font-semibold text-slate-900",
    certMeta: "text-[11px] text-slate-600",
    certUrl: "text-[10px] text-slate-500",
    langRow: "flex justify-between gap-4 text-[11px]",
    langName: "font-semibold text-slate-900",
    langLevel: "text-slate-600",
  },
};

function sectionTitle(variant: HtmlTemplateVariant, sectionId: ManageableSectionId): string {
  if (variant === "modern" && sectionId === "summary") {
    return "Summary";
  }
  if (variant === "modern" && sectionId === "workExperience") {
    return "Experience";
  }
  if (variant === "classic" && sectionId === "workExperience") {
    return "Professional Experience";
  }

  const titles: Record<ManageableSectionId, string> = {
    summary: "Professional Summary",
    workExperience: "Work Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    certifications: "Certifications",
    languages: "Languages",
  };

  return titles[sectionId];
}

function renderSection(
  sectionId: ManageableSectionId,
  view: CvDocumentView,
  styles: VariantStyles,
  variant: HtmlTemplateVariant,
): ReactNode {
  switch (sectionId) {
    case "summary":
      if (!view.summary.trim()) {
        return null;
      }
      return (
        <CvSection
          title={sectionTitle(variant, sectionId)}
          headingClassName={styles.sectionHeading}
          bodyClassName={styles.sectionBody}
        >
          <SummaryBlock summary={view.summary} className={styles.summary} />
        </CvSection>
      );
    case "workExperience":
      if (view.workExperience.length === 0) {
        return null;
      }
      return (
        <CvSection
          title={sectionTitle(variant, sectionId)}
          headingClassName={styles.sectionHeading}
          bodyClassName={styles.sectionBody}
        >
          <WorkExperienceList
            entries={view.workExperience}
            titleClassName={styles.workTitle}
            metaClassName={styles.workMeta}
            bodyClassName={styles.workBody}
            dateClassName={styles.workDate}
          />
        </CvSection>
      );
    case "education":
      if (view.education.length === 0) {
        return null;
      }
      return (
        <CvSection
          title={sectionTitle(variant, sectionId)}
          headingClassName={styles.sectionHeading}
          bodyClassName={styles.sectionBody}
        >
          <EducationList
            entries={view.education}
            titleClassName={styles.eduTitle}
            metaClassName={styles.eduMeta}
            bodyClassName={styles.eduBody}
            dateClassName={styles.eduDate}
          />
        </CvSection>
      );
    case "skills":
      if (view.skillsList.length === 0) {
        return null;
      }
      return (
        <CvSection
          title={sectionTitle(variant, sectionId)}
          headingClassName={styles.sectionHeading}
          bodyClassName={styles.sectionBody}
        >
          <SkillsBlock skills={view.skillsList} className={styles.skills} />
        </CvSection>
      );
    case "projects":
      if (view.projects.length === 0) {
        return null;
      }
      return (
        <CvSection
          title={sectionTitle(variant, sectionId)}
          headingClassName={styles.sectionHeading}
          bodyClassName={styles.sectionBody}
        >
          <ProjectsList
            entries={view.projects}
            titleClassName={styles.projectTitle}
            urlClassName={styles.projectUrl}
            bodyClassName={styles.projectBody}
          />
        </CvSection>
      );
    case "certifications":
      if (view.certifications.length === 0) {
        return null;
      }
      return (
        <CvSection
          title={sectionTitle(variant, sectionId)}
          headingClassName={styles.sectionHeading}
          bodyClassName={styles.sectionBody}
        >
          <CertificationsList
            entries={view.certifications}
            titleClassName={styles.certTitle}
            metaClassName={styles.certMeta}
            urlClassName={styles.certUrl}
          />
        </CvSection>
      );
    case "languages":
      if (view.languages.length === 0) {
        return null;
      }
      return (
        <CvSection
          title={sectionTitle(variant, sectionId)}
          headingClassName={styles.sectionHeading}
          bodyClassName={styles.sectionBody}
        >
          <LanguagesList
            entries={view.languages}
            rowClassName={styles.langRow}
            nameClassName={styles.langName}
            levelClassName={styles.langLevel}
          />
        </CvSection>
      );
    default:
      return null;
  }
}

export function OrderedHtmlBodySections({
  view,
  variant,
}: {
  view: CvDocumentView;
  variant: HtmlTemplateVariant;
}) {
  const styles = VARIANT_STYLES[variant];

  return (
    <>
      {view.visibleSectionOrder.map((sectionId) => (
        <div key={sectionId}>{renderSection(sectionId, view, styles, variant)}</div>
      ))}
    </>
  );
}
