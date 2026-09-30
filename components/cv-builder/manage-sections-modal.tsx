"use client";

import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import {
  getEditorSectionOrder,
  getSectionLabel,
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
  const order = getEditorSectionOrder(state.sectionSettings);

  function updateSettings(next: CvBuilderFormState["sectionSettings"]) {
    onChange({ ...state, sectionSettings: next });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Manage sections"
      description="Change the order of resume sections or hide sections from the preview and PDF. Hidden sections keep their content."
      className="max-w-lg"
    >
      <ul className="space-y-2">
        {order.map((sectionId, index) => {
          const hidden = isSectionHidden(state.sectionSettings, sectionId);
          const label = getSectionLabel(sectionId);

          return (
            <li
              key={sectionId}
              className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50/60 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{label}</p>
                <p className="text-xs text-slate-600">
                  {hidden ? "Hidden from preview and PDF" : "Visible on resume"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {hidden ? (
                  <Badge variant="muted">Hidden</Badge>
                ) : (
                  <Badge>Visible</Badge>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  aria-label={`Move ${label} up`}
                  disabled={index === 0}
                  onClick={() =>
                    updateSettings(moveSection(state.sectionSettings, sectionId, "up"))
                  }
                >
                  Move up
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  aria-label={`Move ${label} down`}
                  disabled={index === order.length - 1}
                  onClick={() =>
                    updateSettings(moveSection(state.sectionSettings, sectionId, "down"))
                  }
                >
                  Move down
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
                  {hidden ? "Show" : "Hide"}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}
