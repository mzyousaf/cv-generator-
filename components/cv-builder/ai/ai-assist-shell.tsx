import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type AiAssistShellProps = {
  children: ReactNode;
  className?: string;
};

export function AiAssistShell({ children, className }: AiAssistShellProps) {
  return (
    <div
      className={cn(
        "space-y-3 border-t border-slate-100 pt-3",
        className,
      )}
    >
      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-600"><span aria-hidden="true">✦</span>AI Assist</p>
      {children}
    </div>
  );
}
