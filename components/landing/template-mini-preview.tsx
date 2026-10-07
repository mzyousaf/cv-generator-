import { CvTemplateRenderer } from "@/components/cv-templates/cv-template-renderer";
import { FitPage } from "@/components/cv-templates/fit-page";
import { TEMPLATE_PREVIEW_SAMPLE_STATE } from "@/components/cv-templates/sample-preview-state";
import type { CvTemplateId } from "@/lib/cv/constants";

type TemplateMiniPreviewProps = {
  templateId: CvTemplateId;
  /** Tailwind height class for the viewport window */
  heightClass?: string;
  scale?: number;
  className?: string;
};

export function TemplateMiniPreview({
  templateId,
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
            ...TEMPLATE_PREVIEW_SAMPLE_STATE,
            template: templateId,
          }}
        />
      </FitPage>
    </div>
  );
}
