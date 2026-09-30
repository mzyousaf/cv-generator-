"use client";

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
                Review your resume
              </h2>
              <p className="max-w-2xl text-sm text-slate-600">
                We found the information below. Check it before creating your
                resume.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>{fileKindLabel(fileType)}</Badge>
              <Badge variant="muted">{formatFileSize(fileSizeBytes)}</Badge>
            </div>
          </div>
          <p className="truncate text-xs text-slate-500" title={filename}>
            Source file: {filename}
          </p>
        </CardContent>
      </Card>

      <ResumeImportReviewForm state={reviewState} onChange={onReviewStateChange} />

      <Card className="sticky bottom-0 z-10 border-slate-200 bg-white/95 shadow-md backdrop-blur-sm">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <p className="text-xs text-slate-500">
            Create resume saves to your account and opens the editor.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isCreating}
              onClick={onBack}
            >
              Back
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={isCreating}
              isLoading={isCreating}
              loadingText="Creating resume…"
              onClick={() => void handleCreateResume()}
            >
              Create Resume
            </Button>
          </div>
        </CardContent>
      </Card>

      {createError ? <FormMessage>{createError}</FormMessage> : null}
    </div>
  );
}
