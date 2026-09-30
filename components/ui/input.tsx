import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, disabled, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      className={cn(
        "h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm transition-colors",
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
});
