"use client";

import { useI18n } from "@/components/i18n/i18n-provider";

import Link from "next/link";
import { CvTemplateRenderer } from "@/components/cv-templates/cv-template-renderer";
import { format } from "@/lib/i18n/format";
import { cvRecordToBuilderState } from "@/lib/cv/builder-mapper";
import { resolveTemplateId } from "@/lib/cv/template-registry";
import type { CVContent } from "@/types/cv";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type ResumeCardProps = {
  title: string;
  template: string;
  updatedAt: string;
  content: CVContent;
  editHref: string;
};

function formatUpdatedAt(iso: string, locale: string): string {
  try {
    return new Date(iso).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function ResumeCard({
  title,
  template,
  updatedAt,
  content,
  editHref,
}: ResumeCardProps) {
  const templateId = resolveTemplateId(template);
  const { t, locale } = useI18n();
  const templateName = t.templateMeta[templateId].name;
  const previewState = cvRecordToBuilderState(title, content, templateId);

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-3xl transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lift">
      <Link
        href={editHref}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block h-56 overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/80"
      >
        <div className="pointer-events-none absolute inset-x-0 top-12 flex justify-center">
          <div className="w-[794px] shrink-0 origin-top scale-[0.26] rounded-sm shadow-[0_30px_60px_-20px_rgb(15_23_42/0.45)] transition-transform duration-500 group-hover:scale-[0.27]">
            <CvTemplateRenderer templateId={templateId} state={previewState} />
          </div>
        </div>
        <span className="absolute start-4 top-4 rounded-full bg-surface/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 shadow-sm ring-1 ring-blue-100 backdrop-blur">
          {templateName}
        </span>
        <span className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pb-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="rounded-full bg-surface px-4 py-1.5 text-xs font-bold text-slate-900 shadow-lg">
            {t.dashboard.openEditor}
          </span>
        </span>
      </Link>
      <CardContent className="flex flex-1 items-center gap-3 border-t border-slate-100 p-4 sm:p-5">
        <div className="min-w-0 flex-1 space-y-1">
          <h3
            dir="auto"
            title={title}
            className="truncate text-base font-bold tracking-tight text-slate-950 [text-align:match-parent]"
          >
            {title}
          </h3>
          <p className="truncate text-xs text-slate-500">
            {format(t.dashboard.edited, { date: formatUpdatedAt(updatedAt, locale) })}
          </p>
        </div>
        <Link
          href={editHref}
          className={cn(
            buttonStyles({ variant: "outline", size: "sm" }),
            "shrink-0 cursor-pointer",
          )}
        >
          {t.dashboard.edit}
        </Link>
      </CardContent>
    </Card>
  );
}
