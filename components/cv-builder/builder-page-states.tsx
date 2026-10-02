"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import Link from "next/link";
import type { CvErrorCode } from "@/lib/cv/errors";
import { CV_ERROR_MESSAGES } from "@/lib/cv/errors";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export function BuilderLoadingState() {
  const { t } = useI18n();
  return (
    <main className="flex min-h-[50vh] items-center justify-center bg-slate-50/50 px-6">
      <p className="flex items-center gap-2 text-sm text-slate-600" role="status">
        <Spinner className="size-4 text-slate-400" />
        {t.builder.loading}
      </p>
    </main>
  );
}

export function BuilderErrorState({ code }: { code: CvErrorCode }) {
  const { t } = useI18n();
  return (
    <main className="flex min-h-[50vh] items-center justify-center bg-slate-50/50 px-6">
      <Card className="max-w-md">
        <CardContent className="space-y-4 py-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            {t.builder.unableToOpen}
          </h1>
          <p className="text-slate-600">{CV_ERROR_MESSAGES[code]}</p>
          <Link
            href="/dashboard"
            className={buttonStyles({ variant: "primary", size: "md" })}
          >
            {t.builder.backToDashboard}
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
