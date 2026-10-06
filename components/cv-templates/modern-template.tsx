import {
  ContactLine,
  EmptyDocumentHint,
} from "@/components/cv-templates/primitives/shared-sections";
import { OrderedHtmlBodySections } from "@/components/cv-templates/ordered-body-sections";
import { DocumentPage } from "@/components/cv-templates/primitives/document-page";
import { buildCvDocumentView } from "@/components/cv-templates/view-model";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";


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
        {view.isEmpty ? <EmptyDocumentHint text={view.labels.emptyHint} className="mb-2" /> : null}

        <OrderedHtmlBodySections view={view} variant="modern" />
      </div>
    </DocumentPage>
  );
}
