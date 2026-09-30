import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, invalid, disabled, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className={cn(
          "min-h-24 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors",
          "placeholder:text-slate-400",
          "hover:border-slate-400",
          "focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20",
          "disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500",
          invalid &&
            "border-red-400 focus:border-red-500 focus:ring-red-500/20",
          className,
        )}
        {...props}
      />
    );
  },
);
