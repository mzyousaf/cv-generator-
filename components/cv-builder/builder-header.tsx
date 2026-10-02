import Link from "next/link";
import { BuilderHeaderMoreMenu } from "@/components/cv-builder/builder-header-more-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogoMark } from "@/components/ui/logo";
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
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200" role="alert">
        <span className="size-1.5 rounded-full bg-red-500" />
        Save failed
      </span>
    );
  }

  switch (saveStatus) {
    case "saving":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100" aria-live="polite">
          <span className="size-1.5 animate-pulse rounded-full bg-blue-500" />
          Saving…
        </span>
      );
    case "saved":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/70" aria-live="polite">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Saved
        </span>
      );
    case "unsaved":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200/70" aria-live="polite">
          <span className="size-1.5 rounded-full bg-amber-500" />
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
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 shadow-[0_1px_0_rgb(255_255_255/0.6)_inset,0_8px_24px_-18px_rgb(15_23_42/0.25)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-4 py-3 xl:flex-row xl:items-center xl:gap-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3 xl:flex-1">
          <Link
            href="/dashboard"
            className="group/back inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl py-1 pl-1 pr-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <LogoMark className="size-7" />
            <span aria-hidden="true" className="transition-transform group-hover/back:-translate-x-0.5">←</span>
            <span className="hidden min-[400px]:inline">Resumes</span>
            <span className="min-[400px]:hidden">Back</span>
          </Link>
          <span className="hidden h-6 w-px bg-slate-200 sm:block" aria-hidden="true" />
          <label className="sr-only" htmlFor="cv-title">
            Resume title
          </label>
          <Input
            id="cv-title"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            className="min-w-0 flex-1 border-transparent bg-transparent text-base font-bold tracking-tight text-slate-950 shadow-none hover:border-slate-200 hover:bg-white focus:bg-white sm:text-lg"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 xl:justify-end xl:gap-4">
          <SaveStatusLabel saveStatus={saveStatus} saveError={saveError} />

          <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
            {showMobilePaneToggle && onMobilePaneChange ? (
              <div
                className="inline-flex rounded-xl border border-slate-200 bg-slate-100/80 p-1 xl:hidden"
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
                      "cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-semibold capitalize transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                      mobilePane === pane
                        ? "bg-white text-blue-700 shadow-[0_1px_3px_rgb(15_23_42/0.12)]"
                        : "text-slate-600 hover:text-slate-900",
                    )}
                    onClick={() => onMobilePaneChange(pane)}
                  >
                    {pane}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="hidden items-center gap-2 xl:flex">
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
