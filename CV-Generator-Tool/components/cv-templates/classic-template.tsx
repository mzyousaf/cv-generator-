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

const sectionHeading =
  "border-b-2 border-zinc-800 pb-1 text-[12px] font-bold uppercase tracking-[0.12em] text-zinc-900";

export function ClassicCvTemplate({ state }: { state: CvBuilderFormState }) {
  const view = buildCvDocumentView(state);

  return (
    <DocumentPage className="px-12 py-12 font-serif">
      <header className="border-b-2 border-zinc-800 pb-5 text-center">
        <h1 className="text-[30px] font-bold leading-tight text-zinc-900">
          {view.displayName}
        </h1>
        <p className="mt-2 text-[15px] font-medium text-zinc-800">
          {view.displayTitle}
        </p>
        <ContactLine
          items={view.contactItems}
          className="mt-3 text-[11px] text-zinc-700"
        />
      </header>

      {view.isEmpty ? <EmptyDocumentHint className="mt-8 text-center" /> : null}

      {view.summary.trim() ? (
        <CvSection title="Professional Summary" headingClassName={sectionHeading} bodyClassName="mt-6">
          <SummaryBlock
            summary={view.summary}
            className="text-[12px] leading-[1.65] text-zinc-800"
          />
        </CvSection>
      ) : null}

      {view.workExperience.length > 0 ? (
        <CvSection title="Professional Experience" headingClassName={sectionHeading} bodyClassName="mt-6">
          <WorkExperienceList
            entries={view.workExperience}
            titleClassName="text-[13px] font-bold text-zinc-900"
            metaClassName="text-[12px] italic text-zinc-700"
            bodyClassName="text-[12px] leading-[1.65] text-zinc-800"
            dateClassName="shrink-0 text-[11px] font-medium text-zinc-700"
          />
        </CvSection>
      ) : null}

      {view.education.length > 0 ? (
        <CvSection title="Education" headingClassName={sectionHeading} bodyClassName="mt-6">
          <EducationList
            entries={view.education}
            titleClassName="text-[13px] font-bold text-zinc-900"
            metaClassName="text-[12px] italic text-zinc-700"
            bodyClassName="text-[12px] leading-[1.65] text-zinc-800"
            dateClassName="shrink-0 text-[11px] font-medium text-zinc-700"
          />
        </CvSection>
      ) : null}

      {view.skillsList.length > 0 ? (
        <CvSection title="Skills" headingClassName={sectionHeading} bodyClassName="mt-6">
          <SkillsBlock
            skills={view.skillsList}
            className="text-[12px] leading-[1.65] text-zinc-800"
          />
        </CvSection>
      ) : null}

      {view.projects.length > 0 ? (
        <CvSection title="Projects" headingClassName={sectionHeading} bodyClassName="mt-6">
          <ProjectsList
            entries={view.projects}
            titleClassName="text-[13px] font-bold text-zinc-900"
            urlClassName="text-[11px] text-zinc-600"
            bodyClassName="text-[12px] leading-[1.65] text-zinc-800"
          />
        </CvSection>
      ) : null}

      {view.certifications.length > 0 ? (
        <CvSection title="Certifications" headingClassName={sectionHeading} bodyClassName="mt-6">
          <CertificationsList
            entries={view.certifications}
            titleClassName="text-[13px] font-bold text-zinc-900"
            metaClassName="text-[12px] text-zinc-700"
            urlClassName="text-[11px] text-zinc-600"
          />
        </CvSection>
      ) : null}

      {view.languages.length > 0 ? (
        <CvSection title="Languages" headingClassName={sectionHeading} bodyClassName="mt-6">
          <LanguagesList
            entries={view.languages}
            rowClassName="flex justify-between gap-4 border-b border-zinc-200 py-1 text-[12px] last:border-b-0"
            nameClassName="font-semibold text-zinc-900"
            levelClassName="text-zinc-700"
          />
        </CvSection>
      ) : null}

      {view.customSections.length > 0 ? (
        <div className="mt-6 space-y-6">
          <CustomSectionsList
            entries={view.customSections}
            headingClassName={sectionHeading}
            bodyClassName="text-[12px] leading-[1.65] text-zinc-800"
          />
        </div>
      ) : null}
    </DocumentPage>
  );
}
