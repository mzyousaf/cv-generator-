import Link from "next/link";
import { BuilderHeaderMoreMenu } from "@/components/cv-builder/builder-header-more-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import type { BuilderMobilePane } from "@/lib/cv/builder-ui-utils";

export type SaveStatus = "saved" | "unsaved" | "saving";

type BuilderHeaderProps = {
  title: string;
  onTitleChange: (value: string) => void;
  saveStatus: SaveStatus;
  saveError: string | null;
  onSave: () => void;
  isSaving: boolean;
  onExportPdf: () => void;
  isExporting: boolean;
  onOpenTemplates: () => void;
  onManageSections: () => void;
  mobilePane?: BuilderMobilePane;
  onMobilePaneChange?: (pane: BuilderMobilePane) => void;
  showMobilePaneToggle?: boolean;
};

function SaveStatusLabel({
  saveStatus,
  saveError,
}: {
  saveStatus: SaveStatus;
  saveError: string | null;
}) {
  if (saveError) {
    return (
      <span className="text-xs font-medium text-red-700 sm:text-sm" role="alert">
        Save failed
      </span>
    );
  }

  switch (saveStatus) {
    case "saving":
      return (
        <span className="text-xs text-slate-500 sm:text-sm" aria-live="polite">
          Saving…
        </span>
      );
    case "saved":
      return (
        <span className="text-xs text-slate-500 sm:text-sm" aria-live="polite">
          Saved
        </span>
      );
    case "unsaved":
      return (
        <span className="text-xs text-amber-700 sm:text-sm" aria-live="polite">
          Unsaved changes
        </span>
      );
    default:
      return null;
  }
}

export function BuilderHeader({
  title,
  onTitleChange,
  saveStatus,
  saveError,
  onSave,
  isSaving,
  onExportPdf,
  isExporting,
  onOpenTemplates,
  onManageSections,
  mobilePane = "edit",
  onMobilePaneChange,
  showMobilePaneToggle = false,
}: BuilderHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-4 py-3 xl:gap-3 xl:py-3.5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Link
            href="/dashboard"
            className="shrink-0 cursor-pointer rounded-md text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <span className="hidden min-[400px]:inline">Back to Resumes</span>
            <span className="min-[400px]:hidden">Back</span>
          </Link>
          <label className="sr-only" htmlFor="cv-title">
            Resume title
          </label>
          <Input
            id="cv-title"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            className="min-w-0 flex-1 border-transparent bg-transparent text-base font-semibold shadow-none focus:border-slate-200 sm:text-lg"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <SaveStatusLabel saveStatus={saveStatus} saveError={saveError} />

          <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
            {showMobilePaneToggle && onMobilePaneChange ? (
              <div
                className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 xl:hidden"
                role="tablist"
                aria-label="Editor workspace"
              >
                {(["edit", "preview"] as const).map((pane) => (
                  <button
                    key={pane}
                    type="button"
                    role="tab"
                    aria-selected={mobilePane === pane}
                    className={cn(
                      "cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
                      mobilePane === pane
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900",
                    )}
                    onClick={() => onMobilePaneChange(pane)}
                  >
                    {pane}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="hidden items-center gap-1.5 xl:flex">
              <Button type="button" variant="ghost" size="sm" onClick={onOpenTemplates}>
                Templates
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onManageSections}
              >
                Manage Sections
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onExportPdf}
                disabled={isExporting || isSaving}
                isLoading={isExporting}
                loadingText="Exporting…"
              >
                Export PDF
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={onSave}
                disabled={isSaving || isExporting || saveStatus === "saved"}
                isLoading={isSaving}
                loadingText="Saving…"
              >
                Save
              </Button>
            </div>

            <div className="flex items-center gap-1.5 xl:hidden">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onExportPdf}
                disabled={isExporting || isSaving}
                isLoading={isExporting}
                loadingText="Exporting…"
                className="hidden min-[400px]:inline-flex"
              >
                Export PDF
              </Button>
              <BuilderHeaderMoreMenu
                onOpenTemplates={onOpenTemplates}
                onManageSections={onManageSections}
                onExportPdf={onExportPdf}
                onSave={onSave}
                isSaving={isSaving}
                isExporting={isExporting}
                saveDisabled={saveStatus === "saved"}
              />
            </div>
          </div>
        </div>

        {saveError ? (
          <p className="text-sm text-red-700" role="alert">
            {saveError}
          </p>
        ) : null}
      </div>
    </header>
  );
}
