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

type SectionOrderListProps = {
  state: CvBuilderFormState;
  onChange: (next: CvBuilderFormState) => void;
  onNavigate: (key: BuilderNavKey) => void;
  activeDomId?: string;
};

type RowProps = {
  sectionKey: BuilderNavKey;
  label: string;
  active: boolean;
  hidden: boolean;
  onNavigate: () => void;
  onToggleHidden?: () => void;
};

// Rows align to the first line so long (wrapped) labels keep icon, handle and toggle level with the text.
const rowClass = "group/row relative flex items-start gap-0.5 rounded-md border border-transparent";

/** Name (scrolls to the section) and visibility toggle, shared by all rows. */
function RowBody({ sectionKey, label, active, hidden, onNavigate, onToggleHidden }: RowProps) {
  const { t } = useI18n();
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
        <span className={cn("min-w-0 flex-1 break-words leading-snug", hidden && "line-through decoration-slate-300")}>
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

function PinnedSectionRow(props: RowProps) {
  return (
    <li className={cn(rowClass, props.active && "bg-blue-50/80")}>
      <span className="w-6 shrink-0" aria-hidden="true" />
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
        rowClass,
        isDragging &&
          "z-10 border-slate-200 bg-surface shadow-[0_8px_24px_-8px_rgb(15_23_42/0.25)]",
        props.active && !isDragging && "bg-blue-50/80",
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
          "flex h-8 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:cursor-grabbing",
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
        <ul className="relative space-y-0.5">
          {keys.map((key) => {
            const common = {
              label: labelOf(key),
              active: activeDomId === builderSectionDomId(key),
              onNavigate: () => onNavigate(key),
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
