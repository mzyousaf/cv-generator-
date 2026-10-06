"use client";

import type { ReactNode } from "react";
import { useI18n } from "@/components/i18n/i18n-provider";
import { useAuthModal } from "@/components/landing/auth-modal-context";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export const LANDING_PRIMARY_CTA = "Create Your CV Free";

type GenerateFreeButtonProps = {
  className?: string;
  variant?: "primary" | "secondary" | "nav" | "inverse";
  children?: ReactNode;
};

const variantMap: Record<
  NonNullable<GenerateFreeButtonProps["variant"]>,
  { variant: ButtonVariant; size: ButtonSize }
> = {
  primary: { variant: "primary", size: "lg" },
  secondary: { variant: "outline", size: "lg" },
  nav: { variant: "primary", size: "sm" },
  inverse: { variant: "inverse", size: "lg" },
};

export function GenerateFreeButton({
  className = "",
  variant = "primary",
  children,
}: GenerateFreeButtonProps) {
  const { t } = useI18n();
  const { openAuthModal } = useAuthModal();
  const mapped = variantMap[variant];

  return (
    <Button
      type="button"
      variant={mapped.variant}
      size={mapped.size}
      className={cn(
        variant === "nav" && "shrink-0 whitespace-nowrap px-3.5 sm:px-4",
        className,
      )}
      onClick={() => openAuthModal("signup")}
    >
      {children ??
        (variant === "nav" ? (
          <>
            <span className="sm:hidden">{t.common.createCvShort}</span>
            <span className="hidden sm:inline">{t.common.createCvFree}</span>
          </>
        ) : (
          t.common.createCvFree
        ))}
    </Button>
  );
}
