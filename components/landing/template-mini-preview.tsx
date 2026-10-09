import { CvTemplateRenderer } from "@/components/cv-templates/cv-template-renderer";
import { FitPage } from "@/components/cv-templates/fit-page";
import { templatePreviewSample } from "@/components/cv-templates/sample-preview-state";
import type { CvTemplateId } from "@/lib/cv/constants";
import type { Locale } from "@/lib/i18n/preferences";

type TemplateMiniPreviewProps = {
  templateId: CvTemplateId;
  /** Language of the sample CV shown in the preview. */
  locale: Locale;
  /** Tailwind height class for the viewport window */
  heightClass?: string;
  scale?: number;
  className?: string;
};

export function TemplateMiniPreview({
  templateId,
  locale,
  heightClass = "h-[340px]",
  scale = 0.36,
  className = "",
}: TemplateMiniPreviewProps) {
  return (
    <div
      className={`relative w-full max-w-full overflow-hidden ${heightClass} ${className}`.trim()}
    >
      <FitPage
        maxScale={scale}
        className="absolute inset-x-3 top-0"
        pageClassName="rounded-t-md shadow-[0_18px_40px_-16px_rgb(15_23_42/0.35)] ring-1 ring-slate-200/80"
      >
        <CvTemplateRenderer
          templateId={templateId}
          state={{
            ...templatePreviewSample(locale),
            template: templateId,
          }}
        />
      </FitPage>
    </div>
  );
}
