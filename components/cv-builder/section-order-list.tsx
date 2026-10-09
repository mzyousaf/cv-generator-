"use client";

import { useId, useMemo } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useI18n } from "@/components/i18n/i18n-provider";
import {
  BuilderSectionIcon,
  DragHandleIcon,
  EyeIcon,
} from "@/components/cv-builder/builder-section-icons";
import {
  builderSectionDomId,
  getOrderedSectionKeys,
  sectionDisplayName,
  type BuilderNavKey,
} from "@/lib/cv/builder-section-nav";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import {
  isSectionHidden,
  reorderSection,
  toggleSectionVisibility,
  type SectionKey,
} from "@/lib/cv/section-settings";
import { format } from "@/lib/i18n/format";
import { cn } from "@/lib/cn";

export type SectionListVariant = "compact" | "cards";

type SectionOrderListProps = {
  state: CvBuilderFormState;
  onChange: (next: CvBuilderFormState) => void;
  onNavigate: (key: BuilderNavKey) => void;
  activeDomId?: string;
  /** "cards": large touch rows with a status line and chevron (mobile list). */
  variant?: SectionListVariant;
  /** Short status under each name in the cards variant (e.g. "3 entries"). */
  subtitleOf?: (key: BuilderNavKey) => string;
};

type RowProps = {
  sectionKey: BuilderNavKey;
  label: string;
  active: boolean;
  hidden: boolean;
  onNavigate: () => void;
  onToggleHidden?: () => void;
  variant: SectionListVariant;
  subtitle?: string;
};

// Rows align to the first line so long (wrapped) labels keep icon, handle and toggle level with the text.
const rowClass = "group/row relative flex items-start gap-0.5 rounded-md border border-transparent";
const cardRowClass =
  "group/row relative flex items-center gap-1 rounded-lg border border-slate-200/80 bg-surface py-1 pe-1 ps-1 shadow-[0_1px_2px_rgb(15_23_42/0.04)]";

function rowClasses(variant: SectionListVariant) {
  return variant === "cards" ? cardRowClass : rowClass;
}

/** Name (scrolls to the section) and visibility toggle, shared by all rows. */
function RowBody({
  sectionKey,
  label,
  active,
  hidden,
  onNavigate,
  onToggleHidden,
  variant,
  subtitle,
}: RowProps) {
  const { t } = useI18n();
  if (variant === "cards") {
    return (
      <>
        <button
          type="button"
          onClick={onNavigate}
          className="flex min-h-14 min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-start max-[360px]:gap-2 max-[360px]:px-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-md max-[360px]:size-8",
              hidden ? "bg-slate-100 text-slate-400" : "bg-blue-50 text-blue-600",
            )}
          >
            <BuilderSectionIcon sectionId={sectionKey} className="size-[18px]" />
          </span>
          <span className="min-w-0 flex-1">
            <span
              className={cn(
                "block hyphens-auto break-words text-[15px] font-semibold max-[360px]:text-sm leading-snug text-slate-900",
                hidden && "text-slate-400 line-through decoration-slate-300",
              )}
            >
              {label}
            </span>
            {subtitle ? (
              <span className="mt-0.5 block truncate text-xs text-slate-500">{subtitle}</span>
            ) : null}
          </span>
          <ChevronIcon className="size-4 shrink-0 text-slate-400 rtl:-scale-x-100" />
        </button>
        {onToggleHidden ? (
          <button
            type="button"
            onClick={onToggleHidden}
            aria-pressed={hidden}
            aria-label={format(hidden ? t.builder.showSection : t.builder.hideSection, { label })}
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <EyeIcon className="size-[18px]" off={hidden} />
          </button>
        ) : (
          // Rows that cannot be hidden keep the same slot, so chevrons line up.
          <span aria-hidden="true" className="size-10 shrink-0" />
        )}
      </>
    );
  }
  return (
    <>
      <button
        type="button"
        onClick={onNavigate}
        aria-current={active ? "true" : undefined}
        className={cn(
          "flex min-w-0 flex-1 cursor-pointer items-start gap-2 rounded px-1.5 py-1.5 text-start text-[13px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          active ? "text-blue-700" : "text-slate-700 hover:text-slate-950",
          hidden && "text-slate-400",
        )}
      >
        <BuilderSectionIcon
          sectionId={sectionKey}
          className={cn("mt-px size-4 shrink-0", active ? "text-blue-600" : "text-slate-400")}
        />
        <span className={cn("min-w-0 flex-1 hyphens-auto break-words leading-snug", hidden && "line-through decoration-slate-300")}>
          {label}
        </span>
      </button>
      {onToggleHidden ? (
        <button
          type="button"
          onClick={onToggleHidden}
          aria-pressed={hidden}
          aria-label={format(hidden ? t.builder.showSection : t.builder.hideSection, { label })}
          title={hidden ? t.builder.show : t.builder.hide}
          className={cn(
            "mt-0.5 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded text-slate-400 transition-opacity hover:bg-slate-100 hover:text-slate-700 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
            hidden ? "opacity-100" : "opacity-0 group-hover/row:opacity-100 max-xl:opacity-100",
          )}
        >
          <EyeIcon className="size-4" off={hidden} />
        </button>
      ) : null}
    </>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function PinnedSectionRow(props: RowProps) {
  const cards = props.variant === "cards";
  return (
    <li className={cn(rowClasses(props.variant), !cards && props.active && "bg-blue-50/80")}>
      <span className={cards ? "w-8 shrink-0" : "w-6 shrink-0"} aria-hidden="true" />
      <RowBody {...props} />
    </li>
  );
}

function SortableSectionRow(props: RowProps & { sectionKey: SectionKey }) {
  const { t } = useI18n();
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: props.sectionKey });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        rowClasses(props.variant),
        isDragging &&
          "z-10 border-slate-200 bg-surface shadow-[0_8px_24px_-8px_rgb(15_23_42/0.25)]",
        props.variant === "compact" && props.active && !isDragging && "bg-blue-50/80",
      )}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        {...attributes}
        {...listeners}
        aria-label={format(t.builder.dragLabel, { label: props.label })}
        title={t.builder.dragToReorder}
        className={cn(
          props.variant === "cards" ? "flex h-11 w-8 shrink-0 cursor-grab touch-none" : "flex h-8 w-6 shrink-0 cursor-grab touch-none",
          "items-center justify-center rounded text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:cursor-grabbing",
          isDragging && "cursor-grabbing text-slate-600",
        )}
      >
        <DragHandleIcon className="size-4" />
      </button>
      <RowBody {...props} />
    </li>
  );
}

/** Drag-and-drop list of resume sections (personal info stays pinned on top). */
export function SectionOrderList({
  state,
  onChange,
  onNavigate,
  activeDomId,
  variant = "compact",
  subtitleOf,
}: SectionOrderListProps) {
  const { t } = useI18n();
  const dndId = useId();
  const keys = getOrderedSectionKeys(state);
  const sortableKeys = keys.filter((key): key is SectionKey => key !== "personal");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const labelOf = (key: BuilderNavKey) =>
    sectionDisplayName(key, state, t.sections, t.editor.untitledSection);

  const announcements = useMemo<Announcements>(() => {
    const name = (id: string | number) => labelOf(id as BuilderNavKey);
    return {
      onDragStart: ({ active }) => format(t.builder.dnd.pickedUp, { label: name(active.id) }),
      onDragOver: ({ active, over }) =>
        over
          ? format(t.builder.dnd.movedOver, { label: name(active.id), target: name(over.id) })
          : "",
      onDragEnd: ({ active }) => format(t.builder.dnd.dropped, { label: name(active.id) }),
      onDragCancel: ({ active }) => format(t.builder.dnd.cancelled, { label: name(active.id) }),
    };
    // labelOf depends on state/t; recompute when they change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, t]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    onChange({
      ...state,
      sectionSettings: reorderSection(
        state.sectionSettings,
        active.id as SectionKey,
        over.id as SectionKey,
        state.customSections,
      ),
    });
  }

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={handleDragEnd}
      accessibility={{
        announcements,
        screenReaderInstructions: { draggable: t.builder.dnd.instructions },
      }}
    >
      <SortableContext items={sortableKeys} strategy={verticalListSortingStrategy}>
        <ul className={cn("relative", variant === "cards" ? "space-y-2" : "space-y-0.5")}>
          {keys.map((key) => {
            const common = {
              label: labelOf(key),
              active: activeDomId === builderSectionDomId(key),
              onNavigate: () => onNavigate(key),
              variant,
              subtitle: subtitleOf?.(key),
            };
            if (key === "personal") {
              return <PinnedSectionRow key={key} sectionKey={key} hidden={false} {...common} />;
            }
            return (
              <SortableSectionRow
                key={key}
                sectionKey={key}
                hidden={isSectionHidden(state.sectionSettings, key)}
                onToggleHidden={() =>
                  onChange({
                    ...state,
                    sectionSettings: toggleSectionVisibility(state.sectionSettings, key),
                  })
                }
                {...common}
              />
            );
          })}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
