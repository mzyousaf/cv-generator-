"use client";

import type { ReactNode } from "react";
import { AuthModal } from "@/components/auth/auth-modal";
import { AuthModalProvider } from "@/components/landing/auth-modal-context";
import { LandingNavbar } from "@/components/landing/navbar";

type LandingShellProps = {
  children: ReactNode;
  footer: ReactNode;
};

export function LandingShell({ children, footer }: LandingShellProps) {
  return (
    <AuthModalProvider>
      <LandingNavbar />
      {children}
      {footer}
      <AuthModal />
    </AuthModalProvider>
  );
}
