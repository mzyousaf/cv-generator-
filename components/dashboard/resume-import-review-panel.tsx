"use client";

import { useI18n } from "@/components/i18n/i18n-provider";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import type { ResumeImportFileKind } from "@/lib/resume-import/constants";
import {
  fileKindLabel,
  formatFileSize,
} from "@/lib/resume-import/validation";
import { createResumeFromImportAction } from "@/lib/resume-import/actions";
import { ResumeImportReviewForm } from "@/components/dashboard/resume-import-review-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormMessage } from "@/components/ui/form-message";
import { format } from "@/lib/i18n/format";
import { Badge } from "@/components/ui/badge";

type ResumeImportReviewPanelProps = {
  filename: string;
  fileType: ResumeImportFileKind;
  fileSizeBytes: number;
  reviewState: CvBuilderFormState;
  onReviewStateChange: (next: CvBuilderFormState) => void;
  onBack: () => void;
};

export function ResumeImportReviewPanel({
  filename,
  fileType,
  fileSizeBytes,
  reviewState,
  onReviewStateChange,
  onBack,
}: ResumeImportReviewPanelProps) {
  const { t } = useI18n();
  const router = useRouter();
  const creatingRef = useRef(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreateResume() {
    if (creatingRef.current || isCreating) {
      return;
    }

    creatingRef.current = true;
    setCreateError(null);
    setIsCreating(true);

    const result = await createResumeFromImportAction(reviewState);
    setIsCreating(false);
    creatingRef.current = false;

    if (!result.success) {
      setCreateError(result.error.message);
      return;
    }

    router.push(`/dashboard/cv/${result.data.cvId}`);
  }

  return (
    <div className="space-y-4">
      <Card className="border-slate-200">
        <CardContent className="space-y-2 p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <h2 className="text-xl font-semibold text-slate-900">
                {t.importer.reviewTitle}
              </h2>
              <p className="max-w-2xl text-sm text-slate-600">
                {t.importer.reviewBody}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>{fileKindLabel(fileType)}</Badge>
              <Badge variant="muted">{formatFileSize(fileSizeBytes)}</Badge>
            </div>
          </div>
          <p className="truncate text-xs text-slate-500" title={filename}>
            {format(t.importer.sourceFile, { name: filename })}
          </p>
        </CardContent>
      </Card>

      <ResumeImportReviewForm state={reviewState} onChange={onReviewStateChange} />

      <Card className="sticky bottom-0 z-10 border-slate-200 bg-surface/95 shadow-md backdrop-blur-sm">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <p className="text-xs text-slate-500">
            {t.importer.createHint}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isCreating}
              onClick={onBack}
            >
              {t.common.back}
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={isCreating}
              isLoading={isCreating}
              loadingText={t.importer.creatingResume}
              onClick={() => void handleCreateResume()}
            >
              {t.importer.createResume}
            </Button>
          </div>
        </CardContent>
      </Card>

      {createError ? <FormMessage>{createError}</FormMessage> : null}
    </div>
  );
}
