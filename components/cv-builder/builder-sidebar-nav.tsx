"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import type { AddSectionMode } from "@/components/cv-builder/add-section-modal";
import { SectionNavActions } from "@/components/cv-builder/section-nav-actions";
import { SectionOrderList } from "@/components/cv-builder/section-order-list";
import { useBuilderActiveSection } from "@/components/cv-builder/use-builder-active-section";
import { cn } from "@/lib/cn";

type BuilderSidebarNavProps = {
  state: CvBuilderFormState;
  onChange: (next: CvBuilderFormState) => void;
  onAddSection: (mode: AddSectionMode) => void;
  className?: string;
};

export function BuilderSidebarNav({
  state,
  onChange,
  onAddSection,
  className,
}: BuilderSidebarNavProps) {
  const { t } = useI18n();
  const [activeDomId, navigate] = useBuilderActiveSection(state);

  return (
    <nav
      aria-label={t.builder.resumeSections}
      className={cn(
        "flex w-[288px] shrink-0 flex-col rounded-xl border border-slate-200/80 bg-surface p-2 shadow-soft",
        className,
      )}
    >
      <div className="px-2 pb-1.5 pt-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
          {t.builder.sections}
        </p>
        <p className="mt-0.5 text-[11px] leading-snug text-slate-400">{t.builder.reorderHint}</p>
      </div>
      <SectionOrderList
        state={state}
        onChange={onChange}
        onNavigate={navigate}
        activeDomId={activeDomId}
      />
      <div className="mt-2 border-t border-slate-100 px-1 pt-2">
        <SectionNavActions onAddSection={onAddSection} />
      </div>
    </nav>
  );
}
