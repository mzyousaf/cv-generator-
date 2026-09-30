import {
  clampPreviewZoom,
  DEFAULT_PREVIEW_ZOOM,
  PREVIEW_ZOOM_LEVELS,
  stepPreviewZoom,
  type PreviewZoomLevel,
} from "@/lib/cv/builder-ui-utils";

/** Fallback width for 210mm at 96dpi until the document is measured. */
export const PREVIEW_DOCUMENT_WIDTH_FALLBACK_PX = 794;

export const PREVIEW_SCALE_MIN = 0.5;
export const PREVIEW_SCALE_MAX = 1;

export type PreviewZoomMode =
  | { type: "fit" }
  | { type: "preset"; level: PreviewZoomLevel };

export function createDefaultPreviewZoomMode(): PreviewZoomMode {
  return { type: "preset", level: DEFAULT_PREVIEW_ZOOM };
}

export function clampPreviewScale(scale: number): number {
  if (!Number.isFinite(scale)) {
    return DEFAULT_PREVIEW_ZOOM / 100;
  }
  return Math.min(PREVIEW_SCALE_MAX, Math.max(PREVIEW_SCALE_MIN, scale));
}

export function presetLevelToScale(level: PreviewZoomLevel): number {
  return level / 100;
}

export function computeFitPreviewScale(
  containerInnerWidth: number,
  documentWidth: number,
  horizontalPadding = 48,
): number {
  if (containerInnerWidth <= 0 || documentWidth <= 0) {
    return DEFAULT_PREVIEW_ZOOM / 100;
  }
  const available = Math.max(0, containerInnerWidth - horizontalPadding);
  return clampPreviewScale(available / documentWidth);
}

export function resolvePreviewScale(
  mode: PreviewZoomMode,
  fitScale: number,
): number {
  if (mode.type === "fit") {
    return clampPreviewScale(fitScale);
  }
  return presetLevelToScale(mode.level);
}

export function formatPreviewZoomLabel(mode: PreviewZoomMode): string {
  if (mode.type === "fit") {
    return "Fit";
  }
  return `${mode.level}%`;
}

export function stepPreviewZoomMode(
  mode: PreviewZoomMode,
  direction: "in" | "out",
  fitScale: number,
): PreviewZoomMode {
  const currentLevel: PreviewZoomLevel =
    mode.type === "preset"
      ? mode.level
      : clampPreviewZoom(Math.round(fitScale * 100));

  return { type: "preset", level: stepPreviewZoom(currentLevel, direction) };
}

export function canStepPreviewZoomIn(mode: PreviewZoomMode): boolean {
  if (mode.type === "fit") {
    return true;
  }
  return mode.level < PREVIEW_ZOOM_LEVELS[PREVIEW_ZOOM_LEVELS.length - 1];
}

export function canStepPreviewZoomOut(mode: PreviewZoomMode): boolean {
  if (mode.type === "fit") {
    return true;
  }
  return mode.level > PREVIEW_ZOOM_LEVELS[0];
}

/** Viewports below 1280px use Edit/Preview instead of editor + preview side-by-side. */
export function shouldUseSinglePaneLayout(viewportWidth: number): boolean {
  return viewportWidth < 1280;
}
