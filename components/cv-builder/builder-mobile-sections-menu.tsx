"use client";

import { useEffect, useRef, useState } from "react";
import {
  getOrderedSectionNavItems,
  scrollToBuilderSection,
} from "@/lib/cv/builder-section-nav";
import {
  isSectionHidden,
  type ManageableSectionId,
} from "@/lib/cv/section-settings";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import { BuilderSectionIcon } from "@/components/cv-builder/builder-section-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type BuilderMobileSectionsMenuProps = {
  state: CvBuilderFormState;
  className?: string;
};

export function BuilderMobileSectionsMenu({
  state,
  className,
}: BuilderMobileSectionsMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navItems = getOrderedSectionNavItems(state.sectionSettings);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((current) => !current)}
        className="w-full justify-between sm:w-auto"
      >
        Sections
        <span aria-hidden className="text-slate-500">
          ▾
        </span>
      </Button>
      {open ? (
        <ul
          aria-label="Resume sections"
          className="absolute left-0 right-0 z-30 mt-1 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg sm:left-0 sm:right-auto sm:min-w-[260px]"
        >
          {navItems.map((item) => {
            const hidden =
              item.id !== "personal" &&
              isSectionHidden(
                state.sectionSettings,
                item.id as ManageableSectionId,
              );

            return (
              <li key={item.id}>
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-left text-sm text-slate-800 hover:bg-slate-50 focus:outline-none focus-visible:bg-slate-50"
                  onClick={() => {
                    scrollToBuilderSection(item.id);
                    setOpen(false);
                  }}
                >
                  <BuilderSectionIcon
                    sectionId={item.id}
                    className="shrink-0 text-slate-500"
                  />
                  <span className="flex-1">{item.label}</span>
                  {hidden ? (
                    <span className="text-xs text-slate-400">Hidden</span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
