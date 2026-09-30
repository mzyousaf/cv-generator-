"use client";

import {
  builderSectionDomId,
  getOrderedSectionNavItems,
  scrollToBuilderSection,
} from "@/lib/cv/builder-section-nav";
import {
  isSectionHidden,
  type ManageableSectionId,
} from "@/lib/cv/section-settings";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import { BuilderSectionIcon } from "@/components/cv-builder/builder-section-icons";
import { useBuilderActiveSection } from "@/components/cv-builder/use-builder-active-section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type BuilderSidebarNavProps = {
  state: CvBuilderFormState;
  onManageSections: () => void;
  className?: string;
};

export function BuilderSidebarNav({
  state,
  onManageSections,
  className,
}: BuilderSidebarNavProps) {
  const activeDomId = useBuilderActiveSection(state);
  const navItems = getOrderedSectionNavItems(state.sectionSettings);

  function handleNavigate(sectionId: ManageableSectionId | "personal") {
    scrollToBuilderSection(sectionId);
  }

  return (
    <nav
      aria-label="Resume sections"
      className={cn(
        "flex w-[220px] shrink-0 flex-col rounded-xl border border-slate-200 bg-white p-2 shadow-sm",
        className,
      )}
    >
      <ul className="space-y-0.5">
        {navItems.map((item) => {
          const domId = builderSectionDomId(item.id);
          const isActive = activeDomId === domId;
          const hidden =
            item.id !== "personal" &&
            isSectionHidden(state.sectionSettings, item.id as ManageableSectionId);

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleNavigate(item.id)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-50",
                )}
              >
                <BuilderSectionIcon
                  sectionId={item.id}
                  className={cn(
                    "shrink-0",
                    isActive ? "text-blue-600" : "text-slate-500",
                  )}
                />
                <span className="min-w-0 flex-1 leading-snug">{item.label}</span>
                {hidden ? (
                  <span
                    className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-slate-400"
                    title="Hidden from resume"
                  >
                    Hidden
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 border-t border-slate-100 pt-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full justify-start text-slate-700"
          onClick={onManageSections}
        >
          Manage Sections
        </Button>
      </div>
    </nav>
  );
}
