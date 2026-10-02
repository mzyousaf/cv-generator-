import type { ComponentProps, ReactElement } from "react";
import { Document } from "@react-pdf/renderer";
import { resolveTemplateId } from "@/lib/cv/template-registry";
import { getRegionalTemplateSpec } from "@/lib/cv/template-catalog";
import type { CvTemplateId } from "@/lib/cv/constants";
import type { CvDocumentView } from "@/components/cv-templates/view-model";
import { registerPdfFonts } from "@/lib/pdf/fonts";
import { ClassicPdfDocument } from "@/lib/pdf/templates/classic-document";
import { DefaultPdfDocument } from "@/lib/pdf/templates/default-document";
import { ModernPdfDocument } from "@/lib/pdf/templates/modern-document";
import { RegionalPdfDocument } from "@/lib/pdf/templates/regional-document";

function templateDocument(view: CvDocumentView, templateId: CvTemplateId | string) {
  const resolved = resolveTemplateId(templateId);
  const regional = getRegionalTemplateSpec(resolved);
  if (regional) {
    return <RegionalPdfDocument view={view} spec={regional} />;
  }

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

export function createCvPdfDocument(
  view: CvDocumentView,
  templateId: CvTemplateId | string,
): ReactElement<ComponentProps<typeof Document>> {
  registerPdfFonts();
  return templateDocument(view, templateId) as ReactElement<ComponentProps<typeof Document>>;
}
