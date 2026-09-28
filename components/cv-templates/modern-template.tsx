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
  "text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500";

export function ModernCvTemplate({ state }: { state: CvBuilderFormState }) {
  const view = buildCvDocumentView(state);

  return (
    <DocumentPage className="overflow-hidden py-0">
      <header className="bg-zinc-900 px-10 py-8 text-white">
        <h1 className="text-[32px] font-semibold leading-tight tracking-tight">
          {view.displayName}
        </h1>
        <p className="mt-2 text-[15px] font-medium text-zinc-200">
          {view.displayTitle}
        </p>
        <ContactLine
          items={view.contactItems}
          className="mt-4 text-[11px] text-zinc-300"
        />
      </header>

      <div className="px-10 py-8">
        {view.isEmpty ? <EmptyDocumentHint className="mb-2" /> : null}

        {view.summary.trim() ? (
          <CvSection title="Summary" headingClassName={sectionHeading} bodyClassName="mt-0">
            <SummaryBlock
              summary={view.summary}
              className="text-[12px] leading-relaxed text-zinc-700"
            />
          </CvSection>
        ) : null}

        {view.workExperience.length > 0 ? (
          <CvSection title="Experience" headingClassName={sectionHeading} bodyClassName="mt-6">
            <WorkExperienceList
              entries={view.workExperience}
              titleClassName="text-[13px] font-semibold text-zinc-900"
              metaClassName="text-[11px] font-medium uppercase tracking-wide text-zinc-500"
              bodyClassName="text-[12px] leading-relaxed text-zinc-700"
              dateClassName="shrink-0 rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700"
            />
          </CvSection>
        ) : null}

        {view.education.length > 0 ? (
          <CvSection title="Education" headingClassName={sectionHeading} bodyClassName="mt-6">
            <EducationList
              entries={view.education}
              titleClassName="text-[13px] font-semibold text-zinc-900"
              metaClassName="text-[11px] font-medium uppercase tracking-wide text-zinc-500"
              bodyClassName="text-[12px] leading-relaxed text-zinc-700"
              dateClassName="shrink-0 rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700"
            />
          </CvSection>
        ) : null}

        {view.skillsList.length > 0 ? (
          <CvSection title="Skills" headingClassName={sectionHeading} bodyClassName="mt-6">
            <SkillsBlock
              skills={view.skillsList}
              className="text-[12px] leading-relaxed text-zinc-700"
            />
          </CvSection>
        ) : null}

        {view.projects.length > 0 ? (
          <CvSection title="Projects" headingClassName={sectionHeading} bodyClassName="mt-6">
            <ProjectsList
              entries={view.projects}
              titleClassName="text-[13px] font-semibold text-zinc-900"
              urlClassName="text-[10px] text-zinc-500"
              bodyClassName="text-[12px] leading-relaxed text-zinc-700"
            />
          </CvSection>
        ) : null}

        {view.certifications.length > 0 ? (
          <CvSection title="Certifications" headingClassName={sectionHeading} bodyClassName="mt-6">
            <CertificationsList
              entries={view.certifications}
              titleClassName="text-[13px] font-semibold text-zinc-900"
              metaClassName="text-[11px] text-zinc-600"
              urlClassName="text-[10px] text-zinc-500"
            />
          </CvSection>
        ) : null}

        {view.languages.length > 0 ? (
          <CvSection title="Languages" headingClassName={sectionHeading} bodyClassName="mt-6">
            <LanguagesList
              entries={view.languages}
              rowClassName="flex justify-between gap-4 text-[12px]"
              nameClassName="font-medium text-zinc-900"
              levelClassName="text-zinc-600"
            />
          </CvSection>
        ) : null}

        {view.customSections.length > 0 ? (
          <div className="mt-6 space-y-6">
            <CustomSectionsList
              entries={view.customSections}
              headingClassName={sectionHeading}
              bodyClassName="text-[12px] leading-relaxed text-zinc-700"
            />
          </div>
        ) : null}
      </div>
    </DocumentPage>
  );
}
