"use client";

import { useI18n } from "@/components/i18n/i18n-provider";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import type { CvTemplateId } from "@/lib/cv/constants";
import { CvTemplateRenderer } from "@/components/cv-templates/cv-template-renderer";
import {
  canStepPreviewZoomIn,
  canStepPreviewZoomOut,
  computeFitPreviewScale,
  formatPreviewZoomLabel,
  PREVIEW_DOCUMENT_WIDTH_FALLBACK_PX,
  resolvePreviewScale,
  stepPreviewZoomMode,
  type PreviewZoomMode,
} from "@/lib/cv/preview-zoom";
import { PREVIEW_ZOOM_LEVELS } from "@/lib/cv/builder-ui-utils";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type BuilderPreviewPanelProps = {
  templateId: CvTemplateId;
  state: CvBuilderFormState;
  onOpenTemplates: () => void;
  templateLabel: string;
  className?: string;
  sticky?: boolean;
};

type DocumentSize = {
  width: number;
  height: number;
};

export function BuilderPreviewPanel({
  templateId,
  state,
  onOpenTemplates,
  templateLabel,
  className,
  sticky = true,
}: BuilderPreviewPanelProps) {
  const { t } = useI18n();
  // Start fitted to the column so the whole page width is visible.
  const [zoomMode, setZoomMode] = useState<PreviewZoomMode>({ type: "fit" });
  const [fitScale, setFitScale] = useState(0.75);
  const [docSize, setDocSize] = useState<DocumentSize>({
    width: PREVIEW_DOCUMENT_WIDTH_FALLBACK_PX,
    height: PREVIEW_DOCUMENT_WIDTH_FALLBACK_PX * 1.414,
  });

  const canvasRef = useRef<HTMLDivElement>(null);
  const docRef = useRef<HTMLDivElement>(null);

  const updateMeasurements = useCallback(() => {
    const doc = docRef.current;
    const canvas = canvasRef.current;
    if (doc) {
      const width = doc.offsetWidth || PREVIEW_DOCUMENT_WIDTH_FALLBACK_PX;
      const height = doc.offsetHeight || width * 1.414;
      setDocSize({ width, height });
      if (canvas) {
        const style = getComputedStyle(canvas);
        const padding =
          parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        setFitScale(computeFitPreviewScale(canvas.clientWidth, width, padding));
      }
    }
  }, []);

  useEffect(() => {
    updateMeasurements();
    const doc = docRef.current;
    const canvas = canvasRef.current;
    if (!doc || !canvas) {
      return;
    }

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(updateMeasurements);
    });
    observer.observe(doc);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [updateMeasurements, state, templateId]);

  const scale = resolvePreviewScale(zoomMode, fitScale);
  const layoutWidth = Math.ceil(docSize.width * scale);
  const layoutHeight = Math.ceil(docSize.height * scale);
  const zoomLabel = zoomMode.type === "fit" ? `${Math.round(scale * 100)}%` : formatPreviewZoomLabel(zoomMode);

  return (
    <aside
      className={cn(
        "flex min-h-0 min-w-0 flex-col",
        sticky && "xl:sticky xl:top-[5.75rem] xl:max-h-[calc(100vh-6.5rem)]",
        className,
      )}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-950"><span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgb(16_185_129/0.18)]" aria-hidden="true" />{t.builder.preview}</h2>
          <button
            type="button"
            onClick={onOpenTemplates}
            className="cursor-pointer truncate text-start text-xs text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            {templateLabel} · {t.builder.changeTemplate}
          </button>
        </div>
        <div
          className="inline-flex flex-wrap items-center rounded-xl border border-slate-200 bg-surface shadow-[0_1px_2px_rgb(15_23_42/0.04)]"
          role="group"
          aria-label={t.builder.previewZoom}
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="min-w-9 px-2 max-sm:min-h-10 max-sm:min-w-10"
            aria-label={t.builder.zoomOut}
            disabled={
              !canStepPreviewZoomOut(zoomMode) ||
              (zoomMode.type === "fit" && scale * 100 <= PREVIEW_ZOOM_LEVELS[0])
            }
            onClick={() =>
              setZoomMode((current) =>
                stepPreviewZoomMode(current, "out", fitScale),
              )
            }
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M3.5 8h9" />
            </svg>
          </Button>
          <span className="min-w-[3.25rem] px-1 text-center text-xs font-medium text-slate-700">
            {zoomLabel}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="min-w-9 px-2 max-sm:min-h-10 max-sm:min-w-10"
            aria-label={t.builder.zoomIn}
            disabled={!canStepPreviewZoomIn(zoomMode)}
            onClick={() =>
              setZoomMode((current) =>
                stepPreviewZoomMode(current, "in", fitScale),
              )
            }
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M3.5 8h9M8 3.5v9" />
            </svg>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "border-s border-slate-200 px-2.5 text-xs max-sm:min-h-10",
              zoomMode.type === "fit" && "bg-slate-50 font-semibold text-slate-900",
            )}
            aria-pressed={zoomMode.type === "fit"}
            onClick={() => setZoomMode({ type: "fit" })}
          >
            {t.builder.fit}
          </Button>
        </div>
      </div>
      <div
        ref={canvasRef}
        dir="ltr"
        className="min-h-0 flex-1 overflow-auto rounded-3xl border border-slate-200/70 bg-gradient-to-br from-slate-100 via-slate-100/70 to-blue-50/60 p-4 shadow-[inset_0_2px_8px_rgb(15_23_42/0.04)] sm:p-6"
      >
        <div
          className="mx-auto"
          style={{ width: layoutWidth, height: layoutHeight }}
        >
          <div
            className="relative overflow-hidden rounded-sm shadow-[0_30px_60px_-24px_rgb(15_23_42/0.4)] ring-1 ring-slate-900/5"
            style={{ width: layoutWidth, height: layoutHeight }}
          >
            <div
              ref={docRef}
              className="absolute start-0 top-0 origin-top-left"
              style={{
                width: docSize.width,
                transform: `scale(${scale})`,
              }}
            >
              <CvTemplateRenderer templateId={templateId} state={state} />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
