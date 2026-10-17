import type { ReactNode } from "react";
import { LandingFooter } from "@/components/landing/footer";
import { LandingShell } from "@/components/landing/landing-shell";

/** Marketing chrome (navbar, footer, auth modal) for public content pages. */
export function PublicPage({ children }: { children: ReactNode }) {
  return (
    <LandingShell footer={<LandingFooter />}>
      <main className="flex-1 overflow-x-hidden bg-background text-slate-900">{children}</main>
    </LandingShell>
  );
}
