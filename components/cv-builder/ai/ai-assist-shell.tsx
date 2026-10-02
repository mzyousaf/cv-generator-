"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type AiAssistShellProps = {
  children: ReactNode;
  className?: string;
};

export function AiAssistShell({ children, className }: AiAssistShellProps) {
  const { t } = useI18n();
  return (
    <div
      className={cn(
        "space-y-3 border-t border-slate-100 pt-3",
        className,
      )}
    >
      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-600"><span aria-hidden="true">✦</span>{t.ai.label}</p>
      {children}
    </div>
  );
}
