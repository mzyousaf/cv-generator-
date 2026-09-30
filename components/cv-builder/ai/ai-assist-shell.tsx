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
      <p className="text-xs font-medium text-slate-500">AI Assist</p>
      {children}
    </div>
  );
}
