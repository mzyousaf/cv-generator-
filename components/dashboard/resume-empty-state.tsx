"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import { CreateCvForm } from "@/components/cv-builder/create-cv-form";
import { UploadIcon } from "@/components/dashboard/icons";
import { Card, CardContent } from "@/components/ui/card";

function StackedDocs() {
  return (
    <div className="relative h-28 w-32" aria-hidden="true">
      <div className="absolute start-3 top-3 h-24 w-20 -rotate-12 rounded-xl border border-slate-200 bg-surface shadow-soft" />
      <div className="absolute end-3 top-3 h-24 w-20 rotate-12 rounded-xl border border-slate-200 bg-surface shadow-soft" />
      <div className="absolute left-1/2 top-0 flex h-26 w-21 -translate-x-1/2 flex-col gap-1.5 rounded-xl border border-blue-200 bg-surface p-3 shadow-lift">
        <span className="h-2 w-10 rounded-full bg-brand-gradient" />
        <span className="h-1.5 w-12 rounded-full bg-slate-200" />
        <span className="mt-1 h-1.5 w-full rounded-full bg-slate-100" />
        <span className="h-1.5 w-full rounded-full bg-slate-100" />
        <span className="h-1.5 w-3/4 rounded-full bg-slate-100" />
        <span className="mt-1 h-1.5 w-full rounded-full bg-slate-100" />
        <span className="h-1.5 w-2/3 rounded-full bg-slate-100" />
      </div>
    </div>
  );
}

export function ResumeEmptyState() {
  const { t } = useI18n();
  return (
    <Card className="relative overflow-hidden rounded-3xl">
      <div
        className="absolute inset-0 bg-dots-soft [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]"
        aria-hidden="true"
      />
      <CardContent className="relative flex flex-col items-center px-6 py-14 text-center sm:py-16">
        <StackedDocs />
        <h3 className="mt-8 text-2xl font-bold tracking-tight text-slate-950">
          {t.dashboard.emptyTitle}
        </h3>
        <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-slate-500">
          {t.dashboard.emptyBody}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          <CreateCvForm
            buttonLabel={t.dashboard.createFirst}
            size="lg"
          />
          <CreateCvForm
            buttonLabel={t.dashboard.importCv}
            size="lg"
            variant="outline"
            initialMode="import"
            leftIcon={<UploadIcon className="size-4" />}
          />
        </div>
      </CardContent>
    </Card>
  );
}
