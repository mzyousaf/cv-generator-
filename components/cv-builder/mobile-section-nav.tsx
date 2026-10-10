"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import type { AddSectionMode } from "@/components/cv-builder/add-section-modal";
import { BuilderSectionIcon } from "@/components/cv-builder/builder-section-icons";
import { SectionNavActions } from "@/components/cv-builder/section-nav-actions";
import { SectionOrderList } from "@/components/cv-builder/section-order-list";
import {
  getOrderedSectionKeys,
  sectionDisplayName,
  type BuilderNavKey,
} from "@/lib/cv/builder-section-nav";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import { isSectionHidden } from "@/lib/cv/section-settings";
import { getSectionStatus } from "@/lib/cv/section-status";
import { format } from "@/lib/i18n/format";
import { cn } from "@/lib/cn";

/** Mobile/tablet home of the editor: every section as a tappable card. */
export function MobileSectionList({
  state,
  onChange,
  onOpen,
  onAddSection,
}: {
  state: CvBuilderFormState;
  onChange: (next: CvBuilderFormState) => void;
  onOpen: (key: BuilderNavKey) => void;
  onAddSection: (mode: AddSectionMode) => void;
}) {
  const { t } = useI18n();
  const copy = t.builder.mobile;

  function subtitleOf(key: BuilderNavKey): string {
    const status = getSectionStatus(key, state);
    const text =
      status.kind === "count"
        ? format(status.count === 1 ? copy.oneItem : copy.items, { n: status.count })
        : status.kind === "filled"
          ? copy.filled
          : copy.empty;
    return key !== "personal" && isSectionHidden(state.sectionSettings, key)
      ? `${text} · ${t.editor.hiddenFromResume}`
      : text;
  }

  return (
    <section aria-label={t.builder.resumeSections} className="space-y-4">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-slate-950">{copy.title}</h2>
        <p className="mt-0.5 text-sm text-slate-500">{copy.hint}</p>
      </div>
      <SectionOrderList
        state={state}
        onChange={onChange}
        onNavigate={onOpen}
        variant="cards"
        subtitleOf={subtitleOf}
      />
      <div className="rounded-lg border border-dashed border-slate-300 p-3">
        <SectionNavActions onAddSection={onAddSection} />
      </div>
    </section>
  );
}

/** Sticky bar on a section's detail screen: back to the list, previous / next. */
export function MobileSectionDetailBar({
  state,
  sectionKey,
  onBack,
  onGo,
}: {
  state: CvBuilderFormState;
  sectionKey: BuilderNavKey;
  onBack: () => void;
  onGo: (key: BuilderNavKey) => void;
}) {
  const { t } = useI18n();
  const copy = t.builder.mobile;
  const keys = getOrderedSectionKeys(state);
  const index = keys.indexOf(sectionKey);
  const previous = index > 0 ? keys[index - 1] : null;
  const next = index >= 0 && index < keys.length - 1 ? keys[index + 1] : null;
  const label = sectionDisplayName(sectionKey, state, t.sections, t.editor.untitledSection);

  const navButton =
    "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-surface text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onBack}
        className="flex h-10 shrink-0 cursor-pointer items-center gap-1 rounded-md pe-2.5 ps-1.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <Chevron className="size-4 rotate-180 rtl:rotate-0" />
        {/* Chevron only on phones, leaving room for the section title. */}
        <span className="max-[430px]:sr-only">{copy.back}</span>
      </button>
      <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5">
        <BuilderSectionIcon sectionId={sectionKey} className="size-4 shrink-0 text-blue-600" />
        <span className="line-clamp-2 text-center text-sm font-semibold leading-tight text-slate-900">{label}</span>
        <span className="shrink-0 text-xs text-slate-400 max-[430px]:hidden">
          {format(copy.position, { n: index + 1, total: keys.length })}
        </span>
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          className={navButton}
          disabled={!previous}
          aria-label={copy.previous}
          onClick={() => previous && onGo(previous)}
        >
          <Chevron className="size-4 rotate-180 rtl:rotate-0" />
        </button>
        <button
          type="button"
          className={navButton}
          disabled={!next}
          aria-label={copy.next}
          onClick={() => next && onGo(next)}
        >
          <Chevron className={cn("size-4 rtl:rotate-180")} />
        </button>
      </div>
    </div>
  );
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
