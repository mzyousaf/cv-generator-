"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import { format } from "@/lib/i18n/format";

import { useState } from "react";
import { updateCvAction } from "@/lib/cv/actions";
import type { CvTemplateId } from "@/lib/cv/constants";
import { CvTemplateRenderer } from "@/components/cv-templates/cv-template-renderer";
import {
  CV_TEMPLATE_REGISTRY,
  getTemplateDefinition,
} from "@/components/cv-templates/registry";
import { TEMPLATE_PREVIEW_SAMPLE_STATE } from "@/components/cv-templates/sample-preview-state";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/cn";

type TemplatePickerModalProps = {
  open: boolean;
  onClose: () => void;
  cvId: string;
  selectedTemplate: CvTemplateId;
  onTemplateChange: (templateId: CvTemplateId) => void;
  onTemplateSaved: (templateId: CvTemplateId) => void;
  onTemplateError: (message: string) => void;
};

function TemplateThumbnail({ templateId }: { templateId: CvTemplateId }) {
  const sampleState: CvBuilderFormState = {
    ...TEMPLATE_PREVIEW_SAMPLE_STATE,
    template: templateId,
  };

  return (
    <div
      aria-hidden
      className="pointer-events-none h-36 overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
    >
      <div className="origin-top-left scale-[0.18]">
        <CvTemplateRenderer templateId={templateId} state={sampleState} />
      </div>
    </div>
  );
}

export function TemplatePickerModal({
  open,
  onClose,
  cvId,
  selectedTemplate,
  onTemplateChange,
  onTemplateSaved,
  onTemplateError,
}: TemplatePickerModalProps) {
  const { t } = useI18n();
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const activeTemplate = getTemplateDefinition(selectedTemplate);

  async function handleSelect(templateId: CvTemplateId) {
    if (templateId === selectedTemplate || isSavingTemplate) {
      return;
    }

    const previousTemplate = selectedTemplate;
    onTemplateChange(templateId);
    setIsSavingTemplate(true);

    const result = await updateCvAction(cvId, { template: templateId });
    setIsSavingTemplate(false);

    if (!result.success) {
      onTemplateError(result.error.message);
      onTemplateChange(previousTemplate);
      return;
    }

    onTemplateSaved(templateId);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t.builder.templates}
      description={`${format(t.builder.templatesCurrent, { name: t.templateMeta[activeTemplate.id].name })}${isSavingTemplate ? t.builder.templatesSaving : ""}`}
      className="max-w-3xl"
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {CV_TEMPLATE_REGISTRY.map((template) => {
          const isSelected = template.id === selectedTemplate;

          return (
            <button
              key={template.id}
              type="button"
              disabled={isSavingTemplate}
              aria-pressed={isSelected}
              onClick={() => void handleSelect(template.id)}
              className={cn(
                "cursor-pointer rounded-xl border p-3 text-start transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed",
                isSelected
                  ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/15"
                  : "border-slate-200 bg-surface hover:border-slate-400 hover:bg-slate-50",
                "disabled:cursor-not-allowed disabled:opacity-60",
              )}
            >
              <TemplateThumbnail templateId={template.id} />
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {t.templateMeta[template.id].name}
              </p>
              <p className="mt-1 text-xs text-slate-600">{t.templateMeta[template.id].description}</p>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
