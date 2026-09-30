"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import type { CvTemplateId } from "@/lib/cv/constants";
import { CvTemplateRenderer } from "@/components/cv-templates/cv-template-renderer";
import {
  canStepPreviewZoomIn,
  canStepPreviewZoomOut,
  computeFitPreviewScale,
  createDefaultPreviewZoomMode,
  formatPreviewZoomLabel,
  PREVIEW_DOCUMENT_WIDTH_FALLBACK_PX,
  resolvePreviewScale,
  stepPreviewZoomMode,
  type PreviewZoomMode,
} from "@/lib/cv/preview-zoom";
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
  const [zoomMode, setZoomMode] = useState<PreviewZoomMode>(
    createDefaultPreviewZoomMode(),
  );
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
        setFitScale(
          computeFitPreviewScale(canvas.clientWidth, width, 32),
        );
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
  const zoomLabel = formatPreviewZoomLabel(zoomMode);

  return (
    <aside
      className={cn(
        "flex min-h-0 min-w-0 flex-col",
        sticky && "xl:sticky xl:top-[4.75rem] xl:max-h-[calc(100vh-5.5rem)]",
        className,
      )}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-slate-900">Preview</h2>
          <button
            type="button"
            onClick={onOpenTemplates}
            className="cursor-pointer truncate text-left text-xs text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            {templateLabel} · Change template
          </button>
        </div>
        <div
          className="inline-flex flex-wrap items-center rounded-lg border border-slate-200 bg-white"
          role="group"
          aria-label="Preview zoom"
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="min-w-9 px-2"
            aria-label="Zoom out"
            disabled={!canStepPreviewZoomOut(zoomMode)}
            onClick={() =>
              setZoomMode((current) =>
                stepPreviewZoomMode(current, "out", fitScale),
              )
            }
          >
            −
          </Button>
          <span className="min-w-[3.25rem] px-1 text-center text-xs font-medium text-slate-700">
            {zoomLabel}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="min-w-9 px-2"
            aria-label="Zoom in"
            disabled={!canStepPreviewZoomIn(zoomMode)}
            onClick={() =>
              setZoomMode((current) =>
                stepPreviewZoomMode(current, "in", fitScale),
              )
            }
          >
            +
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "border-l border-slate-200 px-2.5 text-xs",
              zoomMode.type === "fit" && "bg-slate-50 font-semibold text-slate-900",
            )}
            aria-pressed={zoomMode.type === "fit"}
            onClick={() => setZoomMode({ type: "fit" })}
          >
            Fit
          </Button>
        </div>
      </div>
      <div
        ref={canvasRef}
        className="min-h-0 flex-1 overflow-auto overflow-x-hidden rounded-xl border border-slate-200 bg-slate-100/80 p-4 sm:p-5"
      >
        <div
          className="mx-auto max-w-full"
          style={{ width: layoutWidth, height: layoutHeight }}
        >
          <div
            className="relative overflow-hidden shadow-lg ring-1 ring-slate-200/80"
            style={{ width: layoutWidth, height: layoutHeight }}
          >
            <div
              ref={docRef}
              className="absolute left-0 top-0 origin-top-left"
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
