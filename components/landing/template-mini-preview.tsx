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

const PREVIEW_PAGE_WIDTH_PX = 794;

export function TemplateMiniPreview({
  templateId,
  heightClass = "h-[340px]",
  scale = 0.36,
  className = "",
}: TemplateMiniPreviewProps) {
  const layoutWidth = Math.ceil(PREVIEW_PAGE_WIDTH_PX * scale);

  return (
    <div
      className={`relative w-full max-w-full overflow-hidden ${heightClass} ${className}`.trim()}
    >
      <div className="absolute left-1/2 top-0 -translate-x-1/2">
        <div
          className="pointer-events-none overflow-hidden rounded-t-md shadow-[0_18px_40px_-16px_rgb(15_23_42/0.35)] ring-1 ring-slate-200/80"
          style={{ width: layoutWidth }}
          aria-hidden="true"
        >
          <div
            className="origin-top-left rtl:origin-top-right"
            style={{
              width: PREVIEW_PAGE_WIDTH_PX,
              transform: `scale(${scale})`,
            }}
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
      </div>
    </div>
  );
}
