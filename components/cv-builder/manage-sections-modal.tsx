"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import { format } from "@/lib/i18n/format";

import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import {
  getEditorSectionOrder,
  isSectionHidden,
  moveSection,
  toggleSectionVisibility,
} from "@/lib/cv/section-settings";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type ManageSectionsModalProps = {
  open: boolean;
  onClose: () => void;
  state: CvBuilderFormState;
  onChange: (next: CvBuilderFormState) => void;
};

export function ManageSectionsModal({
  open,
  onClose,
  state,
  onChange,
}: ManageSectionsModalProps) {
  const { t } = useI18n();
  const order = getEditorSectionOrder(state.sectionSettings);

  function updateSettings(next: CvBuilderFormState["sectionSettings"]) {
    onChange({ ...state, sectionSettings: next });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t.builder.manageTitle}
      description={t.builder.manageDescription}
      className="max-w-lg"
    >
      <ul className="space-y-2">
        {order.map((sectionId, index) => {
          const hidden = isSectionHidden(state.sectionSettings, sectionId);
          const label = t.sections[sectionId];

          return (
            <li
              key={sectionId}
              className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 ps-3.5 pe-2.5"
            >
              <div className="min-w-28 flex-1">
                <p
                  className={cn(
                    "text-sm font-semibold text-slate-900 break-words",
                    hidden && "text-slate-500 line-through decoration-slate-300",
                  )}
                >
                  {label}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      hidden ? "bg-slate-300" : "bg-emerald-500",
                    )}
                  />
                  {hidden ? t.builder.hiddenFromPdf : t.builder.visibleOnResume}
                </p>
              </div>
              <div className="ms-auto flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="size-10 px-0"
                  aria-label={format(t.builder.moveUpLabel, { label })}
                  title={t.builder.moveUp}
                  disabled={index === 0}
                  onClick={() =>
                    updateSettings(moveSection(state.sectionSettings, sectionId, "up"))
                  }
                >
                  <span aria-hidden="true">↑</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="size-10 px-0"
                  aria-label={format(t.builder.moveDownLabel, { label })}
                  title={t.builder.moveDown}
                  disabled={index === order.length - 1}
                  onClick={() =>
                    updateSettings(moveSection(state.sectionSettings, sectionId, "down"))
                  }
                >
                  <span aria-hidden="true">↓</span>
                </Button>
                <Button
                  type="button"
                  variant={hidden ? "primary" : "secondary"}
                  size="sm"
                  className="min-h-10 min-w-28"
                  aria-pressed={hidden}
                  onClick={() =>
                    updateSettings(toggleSectionVisibility(state.sectionSettings, sectionId))
                  }
                >
                  {hidden ? t.builder.show : t.builder.hide}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}
