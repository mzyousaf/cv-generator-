"use client";

import { useId, useRef, useState, type ChangeEvent } from "react";
import { useI18n } from "@/components/i18n/i18n-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { CvTemplateId } from "@/lib/cv/constants";
import { PhotoTooLargeError, resizePhotoFile } from "@/lib/cv/photo-client";
import { templatePhotoPolicy } from "@/lib/cv/template-catalog";

type PhotoFieldProps = {
  value: string;
  templateId: CvTemplateId;
  onChange: (photo: string) => void;
};

export function PhotoField({ value, templateId, onChange }: PhotoFieldProps) {
  const { t } = useI18n();
  const fields = t.editor.fields;
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const policy = templatePhotoPolicy(templateId);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    setError("");
    setIsProcessing(true);
    try {
      onChange(await resizePhotoFile(file));
    } catch (cause) {
      setError(cause instanceof PhotoTooLargeError ? fields.photoTooLarge : fields.photoError);
    } finally {
      setIsProcessing(false);
    }
  }

  const policyHint =
    policy === "expected"
      ? fields.photoExpected
      : policy === "optional"
        ? fields.photoOptional
        : fields.photoHidden;

  return (
    <div className="flex items-start gap-4 max-[360px]:flex-col max-[360px]:gap-3">
      <div
        className={cn(
          "flex h-[100px] w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-surface",
          value ? "border-slate-200" : "border-dashed border-slate-300",
          policy === "none" && value ? "opacity-50" : "",
        )}
      >
        {value ? (
          // Data URL preview; next/image adds nothing for inline images.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={fields.photoAlt} className="h-full w-full object-cover" />
        ) : (
          <svg aria-hidden viewBox="0 0 24 24" className="h-8 w-8 text-slate-300" fill="currentColor">
            <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.4 0-8 2.2-8 5v2h16v-2c0-2.8-3.6-5-8-5Z" />
          </svg>
        )}
      </div>
      <div className="-mt-1 min-w-0 flex-1">
        <label htmlFor={inputId} className="text-sm font-semibold text-slate-800">
          {fields.photo}
        </label>
        <p
          className={cn(
            "mt-0.5 text-xs",
            policy === "expected" ? "font-medium text-emerald-700" : "text-slate-500",
          )}
        >
          {policyHint}
        </p>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => void handleFile(event)}
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            isLoading={isProcessing}
            onClick={() => inputRef.current?.click()}
          >
            {value ? fields.photoReplace : fields.photoUpload}
          </Button>
          {value ? (
            <Button type="button" variant="link-danger" size="sm" onClick={() => onChange("")}>
              {fields.photoRemove}
            </Button>
          ) : null}
        </div>
        <p className="mt-1.5 text-[11px] text-slate-400">{fields.photoFormats}</p>
        {error ? (
          <p role="alert" className="mt-1 text-xs font-medium text-red-600">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
