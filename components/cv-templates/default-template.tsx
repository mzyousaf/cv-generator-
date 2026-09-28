import {
  CertificationsList,
  ContactLine,
  CvSection,
  EducationList,
  EmptyDocumentHint,
  LanguagesList,
  ProjectsList,
  SkillsBlock,
  SummaryBlock,
  WorkExperienceList,
  CustomSectionsList,
} from "@/components/cv-templates/primitives/shared-sections";
import { DocumentPage } from "@/components/cv-templates/primitives/document-page";
import { buildCvDocumentView } from "@/components/cv-templates/view-model";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";

export function DefaultCvTemplate({ state }: { state: CvBuilderFormState }) {
  const view = buildCvDocumentView(state);

  return (
    <DocumentPage className="px-10 py-10">
      <header className="border-b border-zinc-300 pb-4">
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight">
          {view.displayName}
        </h1>
        <p className="mt-1 text-[14px] font-medium text-zinc-700">
          {view.displayTitle}
        </p>
        <ContactLine
          items={view.contactItems}
          className="mt-2 text-[11px] text-zinc-700"
        />
      </header>

      {view.isEmpty ? <EmptyDocumentHint className="mt-8" /> : null}

      {view.summary.trim() ? (
        <CvSection
          title="Professional Summary"
          headingClassName="border-b border-zinc-300 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-700"
          bodyClassName="mt-5"
        >
          <SummaryBlock summary={view.summary} className="text-[11px] leading-relaxed text-zinc-800" />
        </CvSection>
      ) : null}

      {view.workExperience.length > 0 ? (
        <CvSection
          title="Work Experience"
          headingClassName="border-b border-zinc-300 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-700"
          bodyClassName="mt-5"
        >
          <WorkExperienceList
            entries={view.workExperience}
            titleClassName="text-[12px] font-semibold text-zinc-900"
            metaClassName="text-[11px] text-zinc-700"
            bodyClassName="text-[11px] leading-relaxed text-zinc-800"
            dateClassName="shrink-0 text-[10px] text-zinc-600"
          />
        </CvSection>
      ) : null}

      {view.education.length > 0 ? (
        <CvSection
          title="Education"
          headingClassName="border-b border-zinc-300 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-700"
          bodyClassName="mt-5"
        >
          <EducationList
            entries={view.education}
            titleClassName="text-[12px] font-semibold text-zinc-900"
            metaClassName="text-[11px] text-zinc-700"
            bodyClassName="text-[11px] leading-relaxed text-zinc-800"
            dateClassName="shrink-0 text-[10px] text-zinc-600"
          />
        </CvSection>
      ) : null}

      {view.skillsList.length > 0 ? (
        <CvSection
          title="Skills"
          headingClassName="border-b border-zinc-300 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-700"
          bodyClassName="mt-5"
        >
          <SkillsBlock
            skills={view.skillsList}
            className="text-[11px] leading-relaxed text-zinc-800"
          />
        </CvSection>
      ) : null}

      {view.projects.length > 0 ? (
        <CvSection
          title="Projects"
          headingClassName="border-b border-zinc-300 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-700"
          bodyClassName="mt-5"
        >
          <ProjectsList
            entries={view.projects}
            titleClassName="text-[12px] font-semibold text-zinc-900"
            urlClassName="text-[10px] text-zinc-600"
            bodyClassName="text-[11px] leading-relaxed text-zinc-800"
          />
        </CvSection>
      ) : null}

      {view.certifications.length > 0 ? (
        <CvSection
          title="Certifications"
          headingClassName="border-b border-zinc-300 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-700"
          bodyClassName="mt-5"
        >
          <CertificationsList
            entries={view.certifications}
            titleClassName="text-[12px] font-semibold text-zinc-900"
            metaClassName="text-[11px] text-zinc-700"
            urlClassName="text-[10px] text-zinc-600"
          />
        </CvSection>
      ) : null}

      {view.languages.length > 0 ? (
        <CvSection
          title="Languages"
          headingClassName="border-b border-zinc-300 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-700"
          bodyClassName="mt-5"
        >
          <LanguagesList
            entries={view.languages}
            rowClassName="flex justify-between gap-4 text-[11px]"
            nameClassName="font-medium text-zinc-900"
            levelClassName="text-zinc-700"
          />
        </CvSection>
      ) : null}

      {view.customSections.length > 0 ? (
        <div className="mt-5 space-y-5">
          <CustomSectionsList
            entries={view.customSections}
            headingClassName="border-b border-zinc-300 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-700"
            bodyClassName="text-[11px] leading-relaxed text-zinc-800"
          />
        </div>
      ) : null}
    </DocumentPage>
  );
}
