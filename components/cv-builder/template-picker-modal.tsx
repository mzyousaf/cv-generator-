"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/components/i18n/i18n-provider";
import { CvTemplateRenderer } from "@/components/cv-templates/cv-template-renderer";
import { templatePreviewSample } from "@/components/cv-templates/sample-preview-state";
import { Modal } from "@/components/ui/modal";
import { updateCvAction } from "@/lib/cv/actions";
import { cn } from "@/lib/cn";
import { CORE_TEMPLATE_IDS, CV_TEMPLATE_IDS, type CvTemplateId } from "@/lib/cv/constants";
import {
  getRegionalTemplateSpec,
  recommendedTemplateIds,
  TEMPLATE_REGIONS,
  templateRegion,
  type TemplateRegion,
} from "@/lib/cv/template-catalog";
import { format } from "@/lib/i18n/format";
import { LOCALE_LABELS, LOCALES, type Locale } from "@/lib/i18n/preferences";
import { localizeServerMessage } from "@/lib/i18n/server-messages";

type TemplatePickerModalProps = {
  open: boolean;
  onClose: () => void;
  cvId: string;
  selectedTemplate: CvTemplateId;
  documentLocale: Locale;
  onDocumentLocaleChange: (locale: Locale) => void;
  onTemplateChange: (templateId: CvTemplateId) => void;
  onTemplateSaved: (templateId: CvTemplateId) => void;
  onTemplateError: (message: string) => void;
};

type Filter = "recommended" | "all" | TemplateRegion;

const PAGE_WIDTH_PX = { A4: 794, LETTER: 816 } as const;

function TemplateThumbnail({ templateId, locale }: { templateId: CvTemplateId; locale: Locale }) {
  const sample = useMemo(
    () => ({ ...templatePreviewSample(locale), template: templateId }),
    [locale, templateId],
  );
  const width = PAGE_WIDTH_PX[getRegionalTemplateSpec(templateId)?.pageSize ?? "A4"];

  return (
    <div
      aria-hidden
      className="pointer-events-none relative h-44 overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-100 to-blue-50/60"
    >
      <div
        className="absolute left-1/2 top-3 origin-top -translate-x-1/2 scale-[0.2] shadow-[0_20px_40px_-12px_rgb(15_23_42/0.4)]"
        style={{ width }}
      >
        <CvTemplateRenderer templateId={templateId} state={sample} />
      </div>
    </div>
  );
}

export function TemplatePickerModal({
  open,
  onClose,
  cvId,
  selectedTemplate,
  documentLocale,
  onDocumentLocaleChange,
  onTemplateChange,
  onTemplateSaved,
  onTemplateError,
}: TemplatePickerModalProps) {
  const { t } = useI18n();
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [filter, setFilter] = useState<Filter>("recommended");

  const recommended = useMemo(
    () => [...recommendedTemplateIds(documentLocale), ...CORE_TEMPLATE_IDS],
    [documentLocale],
  );
  const visible: CvTemplateId[] =
    filter === "recommended"
      ? recommended
      : filter === "all"
        ? [...CV_TEMPLATE_IDS]
        : CV_TEMPLATE_IDS.filter((id) => templateRegion(id) === filter);

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
      onTemplateError(localizeServerMessage(t, result.error.message));
      onTemplateChange(previousTemplate);
      return;
    }

    onTemplateSaved(templateId);
    onClose();
  }

  const chip = (value: Filter, label: string) => (
    <button
      key={value}
      type="button"
      aria-pressed={filter === value}
      onClick={() => setFilter(value)}
      className={cn(
        "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        filter === value
          ? "border-blue-600 bg-blue-600 text-white"
          : "border-slate-200 bg-surface text-slate-600 hover:border-slate-300 hover:text-slate-900",
      )}
    >
      {label}
    </button>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t.builder.templates}
      description={`${format(t.builder.templatesCurrent, { name: t.templateMeta[selectedTemplate].name })}${isSavingTemplate ? t.builder.templatesSaving : ""}`}
      className="sm:max-w-5xl"
    >
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <label htmlFor="cv-document-locale" className="text-sm font-semibold text-slate-900">
            {t.templatePicker.documentLanguage}
          </label>
          <p className="text-xs text-slate-500">{t.templatePicker.documentLanguageHint}</p>
        </div>
        <select
          id="cv-document-locale"
          value={documentLocale}
          onChange={(event) => onDocumentLocaleChange(event.target.value as Locale)}
          className="h-10 rounded-xl border border-slate-200 bg-surface px-3 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/12"
        >
          {LOCALES.map((code) => (
            <option key={code} value={code}>
              {LOCALE_LABELS[code]}
            </option>
          ))}
        </select>
      </div>

      <div
        className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-2"
        role="group"
        aria-label={t.templatePicker.region}
      >
        {chip("recommended", t.templatePicker.recommended)}
        {chip("all", t.templatePicker.all)}
        {TEMPLATE_REGIONS.map((region) => chip(region, t.templatePicker.regions[region]))}
      </div>

      <p className="mt-1 text-xs font-medium text-slate-500">
        {format(t.templatePicker.count, { n: visible.length })}
      </p>

      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((templateId) => {
          const isSelected = templateId === selectedTemplate;
          const spec = getRegionalTemplateSpec(templateId);
          const region = templateRegion(templateId);

          return (
            <button
              key={templateId}
              type="button"
              disabled={isSavingTemplate}
              aria-pressed={isSelected}
              onClick={() => void handleSelect(templateId)}
              className={cn(
                "group cursor-pointer rounded-2xl border p-3 text-start transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                isSelected
                  ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/15"
                  : "border-slate-200 bg-surface hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-soft",
                "disabled:cursor-not-allowed disabled:opacity-60",
              )}
            >
              <TemplateThumbnail templateId={templateId} locale={documentLocale} />
              <div className="mt-3 flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-slate-950">{t.templateMeta[templateId].name}</p>
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                  {t.templatePicker.regions[region]}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {t.templateMeta[templateId].description}
              </p>
              {spec ? (
                <div className="mt-2 flex flex-wrap gap-1">
                  {[...spec.tags, ...(spec.photo === "expected" ? (["photo"] as const) : [])].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 ring-1 ring-blue-100"
                    >
                      {t.templatePicker.tags[tag]}
                    </span>
                  ))}
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
