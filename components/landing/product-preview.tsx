"use client";

import { useMemo } from "react";
import { useI18n } from "@/components/i18n/i18n-provider";
import { CvTemplateRenderer } from "@/components/cv-templates/cv-template-renderer";
import { FitPage } from "@/components/cv-templates/fit-page";
import { templatePreviewSample } from "@/components/cv-templates/sample-preview-state";
import { CORE_TEMPLATE_IDS, type CvTemplateId } from "@/lib/cv/constants";

const activePreviewTemplate: CvTemplateId = "modern";

function PreviewField({ label, value, clamp }: { label: string; value: string; clamp?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p
        className={`mt-1 rounded-lg border border-slate-200/80 bg-surface px-2.5 py-1.5 text-xs text-slate-800 shadow-[0_1px_2px_rgb(15_23_42/0.04)] ${
          clamp ? "leading-relaxed text-slate-600" : "truncate"
        }`}
      >
        {/* Clamp an inner span: clamping the padded box lets a 4th line peek into the padding. */}
        {clamp ? <span className="line-clamp-3">{value}</span> : value}
      </p>
    </div>
  );
}

export function ProductPreview() {
  const { t, locale } = useI18n();
  // Demo content in the visitor's language.
  const sample = useMemo(() => templatePreviewSample(locale), [locale]);

  return (
    <div
      className="mx-auto w-full max-w-xl lg:max-w-none"
      aria-label={t.preview.label}
    >
      <div className="rounded-[1.4rem] border border-white/15 bg-white/[0.07] p-1.5 shadow-[0_40px_100px_-30px_rgb(0_0_0/0.7)] backdrop-blur">
        <div className="overflow-hidden rounded-[1.1rem] bg-surface">
          <div className="flex items-center gap-3 border-b border-slate-200/80 bg-slate-50 px-4 py-2.5">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
            </div>
            <p className="min-w-0 flex-1 truncate text-center text-xs font-semibold text-slate-700">
              {t.preview.sampleTitle}
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 max-[400px]:hidden text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200/70">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              {t.preview.saved}
            </span>
          </div>

          {/* Template switcher spans the whole window so long names never wrap or truncate. */}
          <div className="hidden border-b border-slate-200/80 bg-slate-50/60 px-4 py-2 sm:block">
          <div className="mx-auto flex max-w-sm gap-1 rounded-lg bg-slate-100 p-0.5">
            {CORE_TEMPLATE_IDS.map((id) => (
              <span
                key={id}
                className={`flex-1 whitespace-nowrap rounded-md px-2 py-1 text-center text-[10px] font-semibold ${
                  id === activePreviewTemplate
                    ? "bg-surface text-blue-700 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                {t.templateMeta[id].name}
              </span>
            ))}
          </div>
          </div>

          <div className="grid gap-0 sm:grid-cols-5">
            <div className="hidden space-y-3 border-e border-slate-200/80 bg-slate-50/60 p-4 sm:col-span-2 sm:block">
              <PreviewField label={t.preview.fullName} value={sample.personal.fullName ?? ""} />
              <PreviewField label={t.preview.title} value={sample.personal.professionalTitle ?? ""} />
              <PreviewField label={t.preview.summary} value={sample.summary ?? ""} clamp />
              <div className="flex flex-wrap gap-1">
                {sample.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 ring-1 ring-blue-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100/60 px-2 py-1.5 text-[10px] font-semibold text-blue-800 ring-1 ring-blue-100">
                <span aria-hidden="true">✦</span> {t.preview.improveWithAi}
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-100 to-slate-200/70 p-3 sm:col-span-3">
              <div className="relative h-[280px] w-full max-w-full overflow-hidden rounded-lg bg-surface shadow-[0_12px_30px_-12px_rgb(15_23_42/0.35)] ring-1 ring-slate-200 sm:h-[320px] lg:h-[350px]">
                <FitPage className="absolute inset-0">
                  <CvTemplateRenderer
                    templateId={activePreviewTemplate}
                    state={{
                      ...sample,
                      template: activePreviewTemplate,
                    }}
                  />
                </FitPage>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
