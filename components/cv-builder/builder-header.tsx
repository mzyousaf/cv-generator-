"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import Link from "next/link";
import { BuilderHeaderMoreMenu } from "@/components/cv-builder/builder-header-more-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogoMark } from "@/components/ui/logo";
import { PreferencesMenu } from "@/components/preferences/preferences-menu";
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
  const { t } = useI18n();
  if (saveError) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 max-sm:p-2 text-xs font-semibold text-red-700 ring-1 ring-red-200" title={t.builder.saveFailed} role="alert">
        <span className="size-1.5 rounded-full bg-red-500" />
        <span className="max-sm:sr-only">{t.builder.saveFailed}</span>
      </span>
    );
  }

  switch (saveStatus) {
    case "saving":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 max-sm:p-2 text-xs font-semibold text-blue-700 ring-1 ring-blue-100" title={t.common.saving} aria-live="polite">
          <span className="size-1.5 animate-pulse rounded-full bg-blue-500" />
          <span className="max-sm:sr-only">{t.common.saving}</span>
        </span>
      );
    case "saved":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 max-sm:p-2 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/70" title={t.builder.saved} aria-live="polite">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          <span className="max-sm:sr-only">{t.builder.saved}</span>
        </span>
      );
    case "unsaved":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 max-sm:p-2 text-xs font-semibold text-amber-700 ring-1 ring-amber-200/70" title={t.builder.unsaved} aria-live="polite">
          <span className="size-1.5 rounded-full bg-amber-500" />
          <span className="max-sm:sr-only">{t.builder.unsaved}</span>
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
  mobilePane = "edit",
  onMobilePaneChange,
  showMobilePaneToggle = false,
}: BuilderHeaderProps) {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-surface/95 shadow-[0_1px_0_rgb(255_255_255/0.6)_inset,0_8px_24px_-18px_rgb(15_23_42/0.25)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-4 py-3 xl:flex-row xl:items-center xl:gap-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3 xl:flex-1">
          <Link
            href="/dashboard"
            className="group/back inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl py-1 ps-1 pe-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <LogoMark className="size-7" />
            <span aria-hidden="true" className="transition-transform group-hover/back:-translate-x-0.5 rtl:rotate-180">←</span>
            <span className="hidden min-[400px]:inline">{t.builder.resumes}</span>
            <span className="min-[400px]:hidden">{t.common.back}</span>
          </Link>
          <span className="hidden h-6 w-px bg-slate-200 sm:block" aria-hidden="true" />
          <label className="sr-only" htmlFor="cv-title">
            {t.builder.resumeTitle}
          </label>
          <Input
            id="cv-title"
            dir="auto"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            className="min-w-0 flex-1 border-transparent bg-transparent text-base font-bold tracking-tight text-slate-950 shadow-none hover:border-slate-200 hover:bg-surface focus:bg-surface sm:text-lg"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 xl:justify-end xl:gap-4">
          <SaveStatusLabel saveStatus={saveStatus} saveError={saveError} />

          <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
            {showMobilePaneToggle && onMobilePaneChange ? (
              <div
                className="inline-flex rounded-xl border border-slate-200 bg-slate-100/80 p-1 max-sm:p-0.5 xl:hidden"
                role="tablist"
                aria-label={t.builder.editorPane}
              >
                {(["edit", "preview"] as const).map((pane) => (
                  <button
                    key={pane}
                    type="button"
                    role="tab"
                    aria-selected={mobilePane === pane}
                    className={cn(
                      "cursor-pointer rounded-lg px-3.5 py-1.5 max-sm:px-2.5 max-sm:py-2 text-xs font-semibold capitalize transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                      mobilePane === pane
                        ? "bg-surface text-blue-700 shadow-[0_1px_3px_rgb(15_23_42/0.12)]"
                        : "text-slate-600 hover:text-slate-900",
                    )}
                    onClick={() => onMobilePaneChange(pane)}
                  >
                    {t.builder.panes[pane]}
                  </button>
                ))}
              </div>
            ) : null}

            <PreferencesMenu />

            <div className="hidden items-center gap-2 xl:flex">
              <Button type="button" variant="ghost" size="sm" onClick={onOpenTemplates}>
                {t.builder.templates}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onExportPdf}
                disabled={isExporting || isSaving}
                isLoading={isExporting}
                loadingText={t.builder.exporting}
              >
                {t.builder.exportPdf}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={onSave}
                disabled={isSaving || isExporting || saveStatus === "saved"}
                isLoading={isSaving}
                loadingText={t.common.saving}
              >
                {t.common.save}
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
                loadingText={t.builder.exporting}
                className="max-sm:hidden"
              >
                {t.builder.exportPdf}
              </Button>
              <BuilderHeaderMoreMenu
                onOpenTemplates={onOpenTemplates}
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
