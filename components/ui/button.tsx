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
  "group/btn inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-semibold transition-colors",
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
  "active:scale-[0.99] disabled:cursor-not-allowed disabled:pointer-events-none",
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
    "bg-blue-600 text-white shadow-sm shadow-blue-900/10 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 disabled:text-white disabled:shadow-none",
  secondary:
    "border border-slate-200 bg-slate-100 text-slate-900 shadow-sm hover:border-slate-300 hover:bg-slate-200 active:bg-slate-300 disabled:bg-slate-100 disabled:text-slate-400",
  outline:
    "border border-slate-300 bg-white text-slate-800 shadow-sm hover:border-slate-400 hover:bg-slate-50 active:bg-slate-100 disabled:border-slate-200 disabled:bg-white disabled:text-slate-400",
  ghost:
    "text-slate-700 hover:bg-slate-100 active:bg-slate-200 disabled:text-slate-400",
  danger:
    "bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800 disabled:bg-red-300 disabled:text-white",
  inverse:
    "border border-white/20 bg-white text-slate-900 shadow-md hover:bg-slate-100 active:bg-slate-200 disabled:bg-slate-200 disabled:text-slate-500 focus-visible:ring-white",
  ai: "border border-blue-200 bg-blue-50/80 text-blue-900 shadow-sm hover:border-blue-300 hover:bg-blue-100 active:bg-blue-100/90 disabled:border-blue-100 disabled:bg-blue-50/50 disabled:text-blue-400",
  link: "h-auto min-h-0 rounded-md px-1 py-0 font-semibold text-blue-700 shadow-none hover:bg-transparent hover:text-blue-800 hover:underline active:text-blue-900 disabled:text-slate-400",
  "link-danger":
    "h-auto min-h-0 rounded-md px-1 py-0 font-semibold text-red-700 shadow-none hover:bg-red-50 hover:text-red-800 active:bg-red-100 disabled:text-red-300",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-xs sm:text-sm",
  md: "min-h-10 px-4 text-sm",
  lg: "min-h-11 px-6 text-sm sm:text-base",
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
