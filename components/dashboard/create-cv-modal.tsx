"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/components/i18n/i18n-provider";
import { DictationTextarea } from "@/components/dashboard/dictation-textarea";
import { ResumeUploadDropzone } from "@/components/dashboard/resume-upload-dropzone";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Spinner } from "@/components/ui/spinner";
import { createCvAction } from "@/lib/cv/actions";
import { DEFAULT_TEMPLATE_FOR_LOCALE } from "@/lib/cv/template-catalog";
import { createCvFromDescriptionAction } from "@/lib/resume-import/actions";
import { localizeServerMessage } from "@/lib/i18n/server-messages";
import { cn } from "@/lib/cn";

export type CreateCvMode = "describe" | "import" | "blank";

const MODES: CreateCvMode[] = ["describe", "import", "blank"];
const DESCRIPTION_MAX_LENGTH = 20_000;

type CreateCvModalProps = {
  initialMode: CreateCvMode;
  onClose: () => void;
};

/** Mount only while open so each opening starts fresh. */
export function CreateCvModal({ initialMode, onClose }: CreateCvModalProps) {
  const { t, locale } = useI18n();
  const copy = t.createCv;
  const router = useRouter();
  const [mode, setMode] = useState<CreateCvMode>(initialMode);
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState<"describe" | "blank" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function createFromDescription() {
    if (busy || !description.trim()) {
      return;
    }
    setBusy("describe");
    setError(null);
    try {
      const result = await createCvFromDescriptionAction({ description, locale });
      if (!result.success) {
        setError(localizeServerMessage(t, result.error.message));
        setBusy(null);
        return;
      }
      router.push(`/dashboard/cv/${result.data.cvId}`);
    } catch {
      setError(t.serverErrors.importAiUnavailable);
      setBusy(null);
    }
  }

  async function createBlank() {
    if (busy) {
      return;
    }
    setBusy("blank");
    setError(null);
    const result = await createCvAction({
      title: t.dashboard.untitled,
      template: DEFAULT_TEMPLATE_FOR_LOCALE[locale],
      content: { documentLocale: locale },
    });
    if (!result.success) {
      setError(localizeServerMessage(t, result.error.message));
      setBusy(null);
      return;
    }
    router.push(`/dashboard/cv/${result.data.id}`);
  }

  return (
    <Modal
      open
      onClose={() => {
        if (!busy) onClose();
      }}
      title={copy.title}
      description={copy.description}
      className="max-w-2xl"
    >
      <div
        role="tablist"
        aria-label={copy.title}
        className="mb-5 grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1"
      >
        {MODES.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={mode === item}
            disabled={busy !== null}
            onClick={() => {
              setMode(item);
              setError(null);
            }}
            className={cn(
              "flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-md px-2 py-2 text-center text-xs font-semibold leading-tight transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed sm:text-sm",
              mode === item
                ? "bg-surface text-slate-950 shadow-sm"
                : "text-slate-600 hover:text-slate-900",
            )}
          >
            {item === "describe" ? (
              <span aria-hidden="true" className="text-blue-600">
                ✦
              </span>
            ) : null}
            {copy.tabs[item]}
          </button>
        ))}
      </div>

      {mode === "describe" ? (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="create-cv-description">{copy.describeLabel}</Label>
            <DictationTextarea
              id="create-cv-description"
              value={description}
              onChange={setDescription}
              placeholder={copy.describePlaceholder}
              disabled={busy !== null}
              maxLength={DESCRIPTION_MAX_LENGTH}
            />
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 py-3">
            <p className="text-xs font-semibold text-slate-700">{copy.tipsTitle}</p>
            <ul className="mt-1.5 grid gap-x-4 gap-y-1 text-xs text-slate-600 sm:grid-cols-2">
              {copy.tips.map((tip) => (
                <li key={tip} className="flex gap-1.5">
                  <span aria-hidden="true" className="text-blue-500">
                    •
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          {error ? <FormMessage>{error}</FormMessage> : null}
          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            {busy === "describe" ? (
              <p className="flex items-center gap-2 text-sm text-slate-600" aria-live="polite">
                <Spinner className="size-4" />
                {copy.buildingHint}
              </p>
            ) : (
              <span />
            )}
            <Button
              type="button"
              variant="primary"
              disabled={!description.trim() || busy !== null}
              isLoading={busy === "describe"}
              loadingText={copy.building}
              onClick={() => void createFromDescription()}
            >
              {copy.createWithAi}
            </Button>
          </div>
        </div>
      ) : null}

      {mode === "import" ? <ResumeUploadDropzone /> : null}

      {mode === "blank" ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center">
            <p className="text-sm font-semibold text-slate-900">{copy.blankTitle}</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{copy.blankBody}</p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              isLoading={busy === "blank"}
              loadingText={t.dashboard.creating}
              onClick={() => void createBlank()}
            >
              {copy.blankButton}
            </Button>
          </div>
          {error ? <FormMessage>{error}</FormMessage> : null}
        </div>
      ) : null}
    </Modal>
  );
}
