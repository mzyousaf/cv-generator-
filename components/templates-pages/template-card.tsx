"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n/i18n-provider";
import { TemplateMiniPreview } from "@/components/landing/template-mini-preview";
import type { CvTemplateId } from "@/lib/cv/constants";
import { getRegionalTemplateSpec, templateFacets } from "@/lib/cv/template-catalog";
import { templatePath } from "@/lib/seo";

/** Card linking to a template's page; the preview is optional to keep long lists light. */
export function TemplateCard({ id, preview = false }: { id: CvTemplateId; preview?: boolean }) {
  const { t, locale } = useI18n();
  const facets = templateFacets(id);
  const tags = getRegionalTemplateSpec(id)?.tags ?? (facets.ats ? (["ats"] as const) : []);
  return (
    <Link
      href={templatePath(id)}
      style={preview ? { contentVisibility: "auto", containIntrinsicSize: "auto 420px" } : undefined}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-surface shadow-soft transition-all hover:-translate-y-0.5 hover:border-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      {preview ? (
        <div className="border-b border-slate-200/70 bg-gradient-to-br from-slate-100 to-blue-50/50 pt-4">
          <TemplateMiniPreview templateId={id} locale={locale} heightClass="h-56" scale={0.3} />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 text-base font-bold text-slate-950 group-hover:text-blue-700">{t.templateMeta[id].name}</h3>
          <span className="mt-0.5 max-w-[50%] truncate rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
            {t.templatePicker.regions[facets.region]}
          </span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{t.templateMeta[id].description}</p>
        <ul className="mt-auto flex flex-wrap gap-1 pt-3">
          <li className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600">
            {t.templatePicker.styles[facets.style]}
          </li>
          {tags.map((tag) => (
            <li key={tag} className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-100">
              {t.templatePicker.tags[tag]}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
