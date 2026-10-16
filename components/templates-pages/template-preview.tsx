"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import { TemplateMiniPreview } from "@/components/landing/template-mini-preview";
import type { CvTemplateId } from "@/lib/cv/constants";

/** Large sample-CV preview for a template page, in the visitor's language. */
export function TemplatePreview({ id }: { id: CvTemplateId }) {
  const { locale } = useI18n();
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-100 to-blue-50/60 pt-6 shadow-lift">
      <TemplateMiniPreview templateId={id} locale={locale} heightClass="h-[460px] sm:h-[620px]" scale={0.72} />
    </div>
  );
}
