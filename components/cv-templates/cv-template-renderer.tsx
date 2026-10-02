import { ClassicCvTemplate } from "@/components/cv-templates/classic-template";
import { DefaultCvTemplate } from "@/components/cv-templates/default-template";
import { ModernCvTemplate } from "@/components/cv-templates/modern-template";
import { resolveTemplateId } from "@/lib/cv/template-registry";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import type { CvTemplateId } from "@/lib/cv/constants";

type CvTemplateRendererProps = {
  templateId: CvTemplateId | string;
  state: CvBuilderFormState;
};

export function CvTemplateRenderer({
  templateId,
  state,
}: CvTemplateRendererProps) {
  // The CV is printed paper: keep it on the light palette in dark mode.
  return (
    <div className="scheme-light" dir="ltr">
      {renderTemplate(templateId, state)}
    </div>
  );
}

function renderTemplate(templateId: CvTemplateId | string, state: CvBuilderFormState) {
  switch (resolveTemplateId(templateId)) {
    case "classic":
      return <ClassicCvTemplate state={state} />;
    case "modern":
      return <ModernCvTemplate state={state} />;
    case "default":
    default:
      return <DefaultCvTemplate state={state} />;
  }
}
