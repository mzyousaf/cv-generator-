import {
  ContactLine,
  EmptyDocumentHint,
} from "@/components/cv-templates/primitives/shared-sections";
import { OrderedHtmlBodySections } from "@/components/cv-templates/ordered-body-sections";
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

      {view.isEmpty ? <EmptyDocumentHint text={view.labels.emptyHint} className="mt-8" /> : null}

      <OrderedHtmlBodySections view={view} variant="default" />
    </DocumentPage>
  );
}
