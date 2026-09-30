import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Label } from "@/components/ui/label";

type FieldProps = {
  label: string;
  htmlFor: string;
  hint?: string;
  className?: string;
  children: ReactNode;
};

export function Field({
  label,
  htmlFor,
  hint,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}
