import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type BadgeVariant = "default" | "success" | "warning" | "muted";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-blue-50 text-blue-800 ring-blue-100",
  success: "bg-emerald-50 text-emerald-800 ring-emerald-200/80",
  warning: "bg-amber-50 text-amber-800 ring-amber-200/80",
  muted: "bg-slate-100 text-slate-600 ring-slate-200",
};

export function Badge({
  variant = "default",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
