"use client";

import type { ReactNode } from "react";
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
  children = LANDING_PRIMARY_CTA,
}: GenerateFreeButtonProps) {
  const { openAuthModal } = useAuthModal();
  const mapped = variantMap[variant];

  return (
    <Button
      type="button"
      variant={mapped.variant}
      size={mapped.size}
      className={cn(
        variant === "nav" &&
          "max-w-[11rem] px-3 text-center text-xs leading-tight sm:max-w-none sm:px-4 sm:text-sm",
        className,
      )}
      onClick={() => openAuthModal("signup")}
    >
      {children}
    </Button>
  );
}
