"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import Link from "next/link";
import type { CvErrorCode } from "@/lib/cv/errors";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

const CV_ERROR_KEYS = {
  UNAUTHENTICATED: "cvUnauthenticated",
  NOT_FOUND: "cvNotFound",
  FORBIDDEN: "cvForbidden",
  INVALID_INPUT: "cvInvalidInput",
  DATABASE_ERROR: "cvDatabase",
} as const satisfies Record<CvErrorCode, string>;

export function BuilderLoadingState() {
  const { t } = useI18n();
  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-50/50 px-6">
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
    <main className="flex min-h-dvh items-center justify-center bg-slate-50/50 px-6">
      <Card className="max-w-md">
        <CardContent className="space-y-4 py-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            {t.builder.unableToOpen}
          </h1>
          <p className="text-slate-600">{t.serverErrors[CV_ERROR_KEYS[code]]}</p>
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
