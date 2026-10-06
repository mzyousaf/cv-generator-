"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import { useEffect, useRef, useState } from "react";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import type { AddSectionMode } from "@/components/cv-builder/add-section-modal";
import { SectionNavActions } from "@/components/cv-builder/section-nav-actions";
import { SectionOrderList } from "@/components/cv-builder/section-order-list";
import { useBuilderActiveSection } from "@/components/cv-builder/use-builder-active-section";
import {
  builderSectionDomId,
  getOrderedSectionKeys,
  sectionDisplayName,
} from "@/lib/cv/builder-section-nav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type BuilderMobileSectionsMenuProps = {
  state: CvBuilderFormState;
  onChange: (next: CvBuilderFormState) => void;
  onAddSection: (mode: AddSectionMode) => void;
  className?: string;
};

export function BuilderMobileSectionsMenu({
  state,
  onChange,
  onAddSection,
  className,
}: BuilderMobileSectionsMenuProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [activeDomId, navigate] = useBuilderActiveSection(state);
  const activeKey = getOrderedSectionKeys(state).find(
    (key) => builderSectionDomId(key) === activeDomId,
  );
  const activeLabel = activeKey
    ? sectionDisplayName(activeKey, state, t.sections, t.editor.untitledSection)
    : "";
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="w-full justify-between sm:w-auto sm:min-w-[260px]"
      >
        <span className="flex min-w-0 items-center gap-1.5">
          <span>{t.builder.sections}</span>
          {activeLabel ? (
            <span className="truncate font-normal text-slate-500">· {activeLabel}</span>
          ) : null}
        </span>
        <span aria-hidden className={cn("text-slate-500 transition-transform", open && "rotate-180")}>
          ▾
        </span>
      </Button>
      {open ? (
        <div className="absolute start-0 end-0 z-30 mt-1 rounded-lg border border-slate-200 bg-surface p-2 shadow-lg sm:end-auto sm:w-[300px]">
          <p className="px-2 pb-1.5 text-[11px] leading-snug text-slate-400">{t.builder.reorderHint}</p>
          <div className="max-h-[50vh] overflow-y-auto">
            <SectionOrderList
              state={state}
              onChange={onChange}
              activeDomId={activeDomId}
              onNavigate={(key) => {
                navigate(key);
                setOpen(false);
              }}
            />
          </div>
          <div className="mt-2 border-t border-slate-100 px-1 pt-2">
            <SectionNavActions
              onAddSection={(mode) => {
                setOpen(false);
                onAddSection(mode);
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
