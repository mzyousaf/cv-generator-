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
        "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition-all duration-150",
        "placeholder:text-slate-400",
        "hover:border-slate-300",
        "focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/12",
        "disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500",
        invalid &&
          "border-red-400 focus:border-red-500 focus:ring-red-500/20",
        className,
      )}
      {...props}
    />
  );
});
