"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import {
  buttonPlainTextValue,
  shouldUseRollingButtonLabel,
} from "@/lib/ui/button-label";
import { Spinner } from "@/components/ui/spinner";

import {
  buttonStyles,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button-styles";

export { buttonStyles };
export type { ButtonSize, ButtonVariant };

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
};

function ButtonLabel({ text }: { text: string }) {
  // A one-line window that slides to a duplicate on hover. The label never
  // wraps (a second line would be clipped), and the gap keeps descenders of
  // one copy from peeking into the window over the other.
  return (
    <span className="inline-block h-[1.25em] max-w-full overflow-hidden whitespace-nowrap leading-none">
      <span className="flex flex-col gap-[0.5em] transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover/btn:-translate-y-[1.75em] motion-reduce:transition-none motion-reduce:group-hover/btn:translate-y-0">
        <span className="flex h-[1.25em] items-center">{text}</span>
        <span aria-hidden="true" className="flex h-[1.25em] items-center">
          {text}
        </span>
      </span>
    </span>
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
