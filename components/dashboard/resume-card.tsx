"use client";

import Link from "next/link";
import { CvTemplateRenderer } from "@/components/cv-templates/cv-template-renderer";
import { getTemplateDefinition } from "@/components/cv-templates/registry";
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

function formatUpdatedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
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
  const templateName = getTemplateDefinition(templateId).name;
  const previewState = cvRecordToBuilderState(title, content, templateId);

  return (
    <Card className="flex h-full flex-col overflow-hidden transition duration-200 hover:border-blue-200 hover:shadow-md">
      <div className="relative h-40 overflow-hidden border-b border-slate-200 bg-slate-100/90">
        <div
          className="pointer-events-none absolute inset-0 flex items-start justify-center overflow-hidden pt-2"
          aria-hidden="true"
        >
          <div className="origin-top scale-[0.16] sm:scale-[0.18]">
            <CvTemplateRenderer templateId={templateId} state={previewState} />
          </div>
        </div>
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-slate-900">
            {title}
          </h3>
          <p className="text-sm text-slate-600">{templateName} template</p>
          <p className="text-xs text-slate-500">
            Updated {formatUpdatedAt(updatedAt)}
          </p>
        </div>
        <Link
          href={editHref}
          className={cn(
            buttonStyles({ variant: "primary", size: "sm" }),
            "w-full cursor-pointer",
          )}
        >
          Edit
        </Link>
      </CardContent>
    </Card>
  );
}
