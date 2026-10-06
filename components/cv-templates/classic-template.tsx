import {
  ContactLine,
  EmptyDocumentHint,
} from "@/components/cv-templates/primitives/shared-sections";
import { OrderedHtmlBodySections } from "@/components/cv-templates/ordered-body-sections";
import { DocumentPage } from "@/components/cv-templates/primitives/document-page";
import { buildCvDocumentView } from "@/components/cv-templates/view-model";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";


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

      {view.isEmpty ? <EmptyDocumentHint text={view.labels.emptyHint} className="mt-8 text-center" /> : null}

      <OrderedHtmlBodySections view={view} variant="classic" />
    </DocumentPage>
  );
}
