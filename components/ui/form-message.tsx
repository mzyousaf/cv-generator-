import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type FormMessageProps = HTMLAttributes<HTMLParagraphElement> & {
  variant?: "error" | "info";
};

const variantClasses: Record<NonNullable<FormMessageProps["variant"]>, string> =
  {
    error: "border-red-200 bg-red-50 text-red-800",
    info: "border-slate-200 bg-slate-50 text-slate-700",
  };

export function FormMessage({
  variant = "error",
  className,
  children,
  ...props
}: FormMessageProps) {
  if (!children) {
    return null;
  }

  return (
    <p
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "rounded-lg border px-3 py-2 text-sm",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
