"use client";

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

type TemplateSelectorProps = {
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
      className="pointer-events-none h-36 overflow-hidden rounded-md border border-zinc-200 bg-zinc-100"
    >
      <div className="origin-top-left scale-[0.18]">
        <CvTemplateRenderer templateId={templateId} state={sampleState} />
      </div>
    </div>
  );
}

export function TemplateSelector({
  cvId,
  selectedTemplate,
  onTemplateChange,
  onTemplateSaved,
  onTemplateError,
}: TemplateSelectorProps) {
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

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
  }

  const activeTemplate = getTemplateDefinition(selectedTemplate);

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">Template</h2>
          <p className="text-sm text-zinc-500">
            {activeTemplate.name}
            {isSavingTemplate ? " · Saving template..." : ""}
          </p>
        </div>
      </div>

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
              className={`rounded-lg border p-3 text-left transition-colors ${
                isSelected
                  ? "border-zinc-900 ring-2 ring-zinc-900/10"
                  : "border-zinc-200 hover:border-zinc-400"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <TemplateThumbnail templateId={template.id} />
              <p className="mt-2 text-sm font-semibold text-zinc-900">
                {template.name}
              </p>
              <p className="mt-1 text-xs text-zinc-500">{template.description}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
