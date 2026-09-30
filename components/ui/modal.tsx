"use client";

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
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 sm:items-center"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl",
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
        "pr-10 text-2xl font-semibold tracking-tight text-slate-900",
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
  return (
    <Button
      ref={ref}
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClose}
      aria-label="Close dialog"
      className={cn(
        "absolute right-3 top-3 min-h-9 min-w-9 px-2 text-slate-500 hover:text-slate-800",
        className,
      )}
    >
      <span aria-hidden="true" className="text-xl leading-none">
        ×
      </span>
    </Button>
  );
});

export function ModalDivider({ children = "or continue with" }: { children?: ReactNode }) {
  return (
    <div className="relative py-1 text-center">
      <span className="relative z-10 bg-white px-3 text-xs font-medium uppercase tracking-wide text-slate-500">
        {children}
      </span>
      <div
        className="absolute inset-x-0 top-1/2 border-t border-slate-200"
        aria-hidden="true"
      />
    </div>
  );
}
