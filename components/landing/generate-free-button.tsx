"use client";

import type { ReactNode } from "react";
import { useAuthModal } from "@/components/landing/auth-modal-context";

export const LANDING_PRIMARY_CTA = "Create Your CV Free";

type GenerateFreeButtonProps = {
  className?: string;
  variant?: "primary" | "secondary" | "nav";
  children?: ReactNode;
};

const variantClasses: Record<NonNullable<GenerateFreeButtonProps["variant"]>, string> = {
  primary:
    "inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-900/10 transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:text-base",
  secondary:
    "inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
  nav: "inline-flex min-h-10 max-w-[11rem] items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-center text-xs font-semibold leading-tight text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:max-w-none sm:px-4 sm:text-sm",
};

export function GenerateFreeButton({
  className = "",
  variant = "primary",
  children = LANDING_PRIMARY_CTA,
}: GenerateFreeButtonProps) {
  const { openAuthModal } = useAuthModal();

  return (
    <button
      type="button"
      className={`${variantClasses[variant]} ${className}`.trim()}
      onClick={() => openAuthModal("signup")}
    >
      {children}
    </button>
  );
}
