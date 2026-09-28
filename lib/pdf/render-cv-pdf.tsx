import type { ComponentProps, ReactElement } from "react";
import { Document } from "@react-pdf/renderer";
import { resolveTemplateId } from "@/lib/cv/template-registry";
import type { CvTemplateId } from "@/lib/cv/constants";
import type { CvDocumentView } from "@/components/cv-templates/view-model";
import { ClassicPdfDocument } from "@/lib/pdf/templates/classic-document";
import { DefaultPdfDocument } from "@/lib/pdf/templates/default-document";
import { ModernPdfDocument } from "@/lib/pdf/templates/modern-document";

export function createCvPdfDocument(
  view: CvDocumentView,
  templateId: CvTemplateId | string,
): ReactElement<ComponentProps<typeof Document>> {
  const resolved = resolveTemplateId(templateId);

  switch (resolved) {
    case "classic":
      return <ClassicPdfDocument view={view} />;
    case "modern":
      return <ModernPdfDocument view={view} />;
    case "default":
    default:
      return <DefaultPdfDocument view={view} />;
  }
}
