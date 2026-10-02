"use client";

import { useMemo } from "react";
import { useI18n } from "@/components/i18n/i18n-provider";
import type { EntrySummaryLabels } from "@/lib/cv/builder-ui-utils";

/** Localised fallbacks for collapsed entry-card titles and subtitles. */
export function useEntrySummaryLabels(): EntrySummaryLabels {
  const { t, locale } = useI18n();
  return useMemo(
    () => ({ locale, ...t.editor.summaries }),
    [locale, t],
  );
}
