import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

/**
 * Native select with our own chevron. Browsers draw the default arrow flush
 * against the edge and ignore inline padding, so the text and arrow never
 * looked evenly inset; here both sides use the same 14px gutter and the
 * chevron follows the reading direction.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...props },
  ref,
) {
  return (
    <span className={cn("relative inline-flex", className)}>
      <select
        ref={ref}
        className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-surface ps-3.5 pe-10 text-sm font-medium text-slate-900 shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition-colors hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/12"
        {...props}
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="pointer-events-none absolute end-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 6l4 4 4-4" />
      </svg>
    </span>
  );
});
