"use client";

import { useI18n } from "@/components/i18n/i18n-provider";

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
  const { t } = useI18n();
  const activeDomId = useBuilderActiveSection(state);
  const navItems = getOrderedSectionNavItems(state.sectionSettings);

  function handleNavigate(sectionId: ManageableSectionId | "personal") {
    scrollToBuilderSection(sectionId);
  }

  return (
    <nav
      aria-label={t.builder.resumeSections}
      className={cn(
        "flex w-[230px] shrink-0 flex-col rounded-3xl border border-slate-200/70 bg-surface/80 p-2.5 shadow-soft backdrop-blur",
        className,
      )}
    >
      <p className="px-2.5 pb-2 pt-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
        {t.builder.sections}
      </p>
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
                  "flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-start text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-blue-100/40 text-blue-700 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--brand-600)_12%,transparent)]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                )}
              >
                <BuilderSectionIcon
                  sectionId={item.id}
                  className={cn(
                    "shrink-0",
                    isActive ? "text-blue-600" : "text-slate-400",
                  )}
                />
                <span className="flex min-w-0 flex-1 flex-col leading-snug">
                  <span className={cn("break-words", hidden && "text-slate-500")}>
                    {t.sections[item.id]}
                  </span>
                  {hidden ? (
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wide text-slate-400"
                      title={t.editor.hiddenFromResume}
                    >
                      {t.common.hidden}
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-2 border-t border-slate-100 pt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full justify-start text-slate-700"
          onClick={onManageSections}
        >
          {t.builder.manageSections}
        </Button>
      </div>
    </nav>
  );
}
