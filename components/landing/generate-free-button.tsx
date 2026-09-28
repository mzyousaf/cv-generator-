"use client";

import type { ReactNode } from "react";
import { useAuthModal } from "@/components/landing/auth-modal-context";

type GenerateFreeButtonProps = {
  className?: string;
  variant?: "primary" | "secondary" | "nav";
  children?: ReactNode;
};

const variantClasses: Record<NonNullable<GenerateFreeButtonProps["variant"]>, string> = {
  primary:
    "inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
  secondary:
    "inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
  nav: "inline-flex items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
};

export function GenerateFreeButton({
  className = "",
  variant = "primary",
  children = "Generate Free",
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
