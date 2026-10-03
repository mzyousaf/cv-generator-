"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import {
  buttonPlainTextValue,
  shouldUseRollingButtonLabel,
} from "@/lib/ui/button-label";
import { Spinner } from "@/components/ui/spinner";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "inverse"
  | "ai"
  | "link"
  | "link-danger";

const textLinkVariants: ButtonVariant[] = ["link", "link-danger"];

export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
};

const baseClasses = cn(
  "group/btn inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-semibold tracking-[-0.005em] transition-all duration-200",
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
  "active:scale-[0.98] disabled:cursor-not-allowed disabled:pointer-events-none",
);

function ButtonLabel({ text }: { text: string }) {
  return (
    <span className="inline-block h-[1.25em] overflow-hidden leading-none">
      <span className="flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover/btn:-translate-y-1/2 motion-reduce:transition-none motion-reduce:group-hover/btn:translate-y-0">
        <span className="flex h-[1.25em] items-center">{text}</span>
        <span aria-hidden="true" className="flex h-[1.25em] items-center">
          {text}
        </span>
      </span>
    </span>
  );
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-gradient text-white shadow-[0_1px_0_rgb(255_255_255/0.25)_inset,0_6px_18px_-6px_color-mix(in_oklab,var(--brand-600)_60%,transparent)] ring-1 ring-blue-700/40 hover:shadow-[0_1px_0_rgb(255_255_255/0.25)_inset,0_10px_26px_-6px_color-mix(in_oklab,var(--brand-600)_70%,transparent)] hover:brightness-110 active:brightness-95 disabled:bg-none disabled:bg-blue-300 disabled:text-white disabled:shadow-none disabled:ring-0",
  secondary:
    "border border-slate-200 bg-slate-100/80 text-slate-900 hover:border-slate-300 hover:bg-slate-200/70 active:bg-slate-200 disabled:bg-slate-100 disabled:text-slate-400",
  outline:
    "border border-slate-200 bg-surface text-slate-800 shadow-[0_1px_2px_rgb(15_23_42/0.05)] hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 active:bg-slate-100 disabled:border-slate-200 disabled:bg-surface disabled:text-slate-400",
  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 disabled:text-slate-400",
  danger:
    "bg-gradient-to-b from-red-500 to-red-600 text-white shadow-[0_6px_16px_-6px_rgb(220_38_38/0.6)] ring-1 ring-red-700/30 hover:brightness-110 active:brightness-95 disabled:from-red-300 disabled:to-red-300 disabled:text-white",
  inverse:
    "bg-surface text-slate-950 shadow-[0_10px_30px_-10px_rgb(255_255_255/0.45)] ring-1 ring-white/60 hover:bg-blue-50 active:bg-blue-100 disabled:bg-slate-200 disabled:text-slate-500 focus-visible:ring-white focus-visible:ring-offset-slate-950",
  ai: "border border-blue-200/80 bg-gradient-to-b from-surface to-blue-50 text-blue-800 shadow-[0_1px_2px_color-mix(in_oklab,var(--brand-600)_8%,transparent)] hover:border-blue-300 hover:from-blue-50 hover:to-blue-100/80 active:to-blue-100 disabled:border-blue-100 disabled:from-blue-50/50 disabled:to-blue-50/50 disabled:text-blue-400",
  link: "h-auto min-h-0 rounded-md px-1 py-0 font-semibold text-blue-700 shadow-none hover:bg-transparent hover:text-blue-800 hover:underline active:text-blue-900 disabled:text-slate-400",
  "link-danger":
    "h-auto min-h-0 rounded-md px-1 py-0 font-semibold text-red-700 shadow-none hover:bg-red-50 hover:text-red-800 active:bg-red-100 disabled:text-red-300",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3.5 text-xs sm:text-sm",
  md: "min-h-10 px-4.5 text-sm",
  lg: "min-h-12 px-7 text-sm sm:text-[0.95rem]",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
} = {}) {
  const isTextLink = textLinkVariants.includes(variant);

  return cn(
    baseClasses,
    variantClasses[variant],
    !isTextLink && sizeClasses[size],
    isTextLink && "inline text-sm",
    fullWidth && "w-full",
    className,
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth,
      isLoading,
      loadingText,
      leftIcon,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref,
  ) {
    const busy = isLoading || disabled;
    const plainText = buttonPlainTextValue(children);
    const useRollingLabel = shouldUseRollingButtonLabel({
      variant,
      children,
      isLoading,
    });

    return (
      <button
        ref={ref}
        type={type}
        disabled={busy}
        aria-busy={isLoading || undefined}
        className={buttonStyles({ variant, size, fullWidth, className })}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner className="size-4" />
            <span>{loadingText ?? plainText ?? children}</span>
          </>
        ) : (
          <>
            {leftIcon ? <span className="shrink-0">{leftIcon}</span> : null}
            {useRollingLabel && plainText ? (
              <ButtonLabel text={plainText} />
            ) : (
              children
            )}
          </>
        )}
      </button>
    );
  },
);
