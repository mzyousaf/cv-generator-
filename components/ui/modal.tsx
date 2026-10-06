"use client";

import { useI18n } from "@/components/i18n/i18n-provider";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  closeButtonRef?: RefObject<HTMLButtonElement | null>;
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
  closeButtonRef,
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-4 backdrop-blur-sm sm:items-center"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "relative max-h-[90dvh] w-full max-w-lg animate-fade-up overflow-y-auto rounded-3xl border border-white/60 bg-surface dark:border-white/10 shadow-[0_30px_80px_-20px_rgb(7_10_26/0.45)] ring-1 ring-slate-900/5",
          className,
        )}
      >
        <ModalClose ref={closeButtonRef} onClose={onClose} />
        <div className="px-6 pb-6 pt-8 sm:px-8 sm:pb-8">
          <ModalTitle id={titleId}>{title}</ModalTitle>
          {description ? (
            <ModalDescription id={descriptionId}>
              {description}
            </ModalDescription>
          ) : null}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function ModalTitle({
  id,
  className,
  children,
}: HTMLAttributes<HTMLHeadingElement> & { id?: string }) {
  return (
    <h2
      id={id}
      className={cn(
        "pe-10 text-2xl font-bold tracking-tight text-slate-950",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function ModalDescription({
  id,
  className,
  children,
}: HTMLAttributes<HTMLParagraphElement> & { id?: string }) {
  return (
    <p
      id={id}
      className={cn("mt-2 text-sm leading-relaxed text-slate-600", className)}
    >
      {children}
    </p>
  );
}

export const ModalClose = forwardRef<
  HTMLButtonElement,
  { onClose: () => void; className?: string }
>(function ModalClose({ onClose, className }, ref) {
  const { t } = useI18n();
  return (
    <Button
      ref={ref}
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClose}
      aria-label={t.common.closeDialog}
      className={cn(
        "absolute end-3 top-3 min-h-10 min-w-10 rounded-full px-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800",
        className,
      )}
    >
      <span aria-hidden="true" className="text-xl leading-none">
        ×
      </span>
    </Button>
  );
});

export function ModalDivider({ children }: { children: ReactNode }) {
  return (
    <div className="relative py-1 text-center">
      <span className="relative z-10 bg-surface px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        {children}
      </span>
      <div
        className="absolute inset-x-0 top-1/2 border-t border-slate-200"
        aria-hidden="true"
      />
    </div>
  );
}
