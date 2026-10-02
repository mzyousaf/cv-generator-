"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import { CV_TEMPLATE_IDS } from "@/lib/cv/constants";
import { GenerateFreeButton } from "@/components/landing/generate-free-button";
import { SectionHeading } from "@/components/landing/section-heading";
import { TemplateMiniPreview } from "@/components/landing/template-mini-preview";

export function TemplatesSection() {
  const { t } = useI18n();
  return (
    <section id="templates" className="scroll-mt-24 bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={t.templatesSection.eyebrow}
          title={t.templatesSection.title}
          description={t.templatesSection.description}
        />

        <ul className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CV_TEMPLATE_IDS.map((templateId) => (
            <li key={templateId}>
              <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-surface shadow-soft transition duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-lift">
                <div className="relative bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/70 px-6 pt-6">
                  <span className="absolute start-4 top-4 z-10 rounded-full bg-surface/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 shadow-sm ring-1 ring-blue-100 backdrop-blur">
                    {t.templatesSection.tags[templateId]}
                  </span>
                  <TemplateMiniPreview
                    templateId={templateId}
                    className="transition-transform duration-500 group-hover:scale-[1.02]"
                    heightClass="h-[260px] sm:h-[290px] lg:h-[300px]"
                    scale={0.34}
                  />
                </div>
                <div className="flex flex-1 items-start justify-between gap-4 border-t border-slate-100 p-6">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-slate-950">
                      {t.templateMeta[templateId].name}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">
                      {t.templateMeta[templateId].description}
                    </p>
                  </div>
                  <span
                    className="mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600"
                    aria-hidden="true"
                  >
                    <span className="rtl:rotate-180">→</span>
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-16 flex flex-col items-center gap-5 text-center">
          <p className="max-w-md text-[0.95rem] leading-relaxed text-slate-500">
            {t.templatesSection.footnote}
          </p>
          <GenerateFreeButton />
        </div>
      </div>
    </section>
  );
}
