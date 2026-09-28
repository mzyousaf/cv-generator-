"use client";

import type { ReactNode } from "react";
import { AuthModal } from "@/components/auth/auth-modal";
import { AuthModalProvider } from "@/components/landing/auth-modal-context";
import { LandingFooter } from "@/components/landing/footer";
import { LandingNavbar } from "@/components/landing/navbar";

export function LandingShell({ children }: { children: ReactNode }) {
  return (
    <AuthModalProvider>
      <LandingNavbar />
      {children}
      <LandingFooter />
      <AuthModal />
    </AuthModalProvider>
  );
}
