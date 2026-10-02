"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import { Button } from "@/components/ui/button";

type AiSuggestionPanelProps = {
  title: string;
  content: string;
  onUse: () => void;
  onDismiss: () => void;
  useLabel?: string;
};

export function AiSuggestionPanel({
  title,
  content,
  onUse,
  onDismiss,
  useLabel,
}: AiSuggestionPanelProps) {
  const { t } = useI18n();
  return (
    <div className="rounded-lg border border-slate-200 bg-surface p-3 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>
      <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">{content}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" variant="primary" size="sm" onClick={onUse}>
          {useLabel ?? t.ai.use}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onDismiss}>
          {t.common.dismiss}
        </Button>
      </div>
    </div>
  );
}
