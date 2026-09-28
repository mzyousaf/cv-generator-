import { CvTemplateRenderer } from "@/components/cv-templates/cv-template-renderer";
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
      className={`relative w-full max-w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100 ${heightClass} ${className}`.trim()}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 origin-top select-none"
        style={{ transform: `translateX(-50%) scale(${scale})` }}
        aria-hidden="true"
      >
        <CvTemplateRenderer
          templateId={templateId}
          state={{
            ...TEMPLATE_PREVIEW_SAMPLE_STATE,
            template: templateId,
          }}
        />
      </div>
    </div>
  );
}
