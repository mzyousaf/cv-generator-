import { ClassicCvTemplate } from "@/components/cv-templates/classic-template";
import { DefaultCvTemplate } from "@/components/cv-templates/default-template";
import { ModernCvTemplate } from "@/components/cv-templates/modern-template";
import { RegionalCvTemplate } from "@/components/cv-templates/regional-template";
import { resolveTemplateId } from "@/lib/cv/template-registry";
import { getRegionalTemplateSpec } from "@/lib/cv/template-catalog";
import { localeDirection } from "@/lib/i18n/preferences";
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
  const locale = state.documentLocale ?? "en";
  return (
    <div className="scheme-light" dir={localeDirection(locale)} lang={locale}>
      {renderTemplate(templateId, state)}
    </div>
  );
}

function renderTemplate(templateId: CvTemplateId | string, state: CvBuilderFormState) {
  const regional = getRegionalTemplateSpec(resolveTemplateId(templateId));
  if (regional) {
    return <RegionalCvTemplate state={state} spec={regional} />;
  }
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
