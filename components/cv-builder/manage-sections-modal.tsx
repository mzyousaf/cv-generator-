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
import { Badge } from "@/components/ui/badge";

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
              className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50/60 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{label}</p>
                <p className="text-xs text-slate-600">
                  {hidden ? t.builder.hiddenFromPdf : t.builder.visibleOnResume}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {hidden ? (
                  <Badge variant="muted">{t.common.hidden}</Badge>
                ) : (
                  <Badge>{t.common.visible}</Badge>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  aria-label={format(t.builder.moveUpLabel, { label })}
                  disabled={index === 0}
                  onClick={() =>
                    updateSettings(moveSection(state.sectionSettings, sectionId, "up"))
                  }
                >
                  {t.builder.moveUp}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  aria-label={format(t.builder.moveDownLabel, { label })}
                  disabled={index === order.length - 1}
                  onClick={() =>
                    updateSettings(moveSection(state.sectionSettings, sectionId, "down"))
                  }
                >
                  {t.builder.moveDown}
                </Button>
                <Button
                  type="button"
                  variant={hidden ? "primary" : "secondary"}
                  size="sm"
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
