"use client";

import { useI18n } from "@/components/i18n/i18n-provider";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  DashboardSidebar,
  type DashboardSidebarUser,
} from "@/components/dashboard/dashboard-sidebar";
import { MobileDashboardHeader } from "@/components/dashboard/mobile-dashboard-header";
import { cn } from "@/lib/cn";

type DashboardShellProps = {
  user: DashboardSidebarUser;
  children: ReactNode;
};

export function DashboardShell({ user, children }: DashboardShellProps) {
  const { t } = useI18n();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const closeMobileNav = useCallback(() => {
    setMobileNavOpen(false);
  }, []);

  useEffect(() => {
    if (!mobileNavOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMobileNav();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileNavOpen, closeMobileNav]);

  return (
    <div className="flex min-h-screen min-w-0 bg-background">
      {/* The aside stretches to the full page height; its content stays pinned while scrolling. */}
      <aside className="scheme-light hidden w-64 shrink-0 self-stretch border-e border-white/5 bg-ink bg-[radial-gradient(80%_40%_at_0%_0%,color-mix(in_oklab,var(--brand-600)_28%,transparent),transparent)] lg:block">
        <div className="sticky top-0 flex h-screen flex-col">
          <DashboardSidebar user={user} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileDashboardHeader
          menuOpen={mobileNavOpen}
          onOpenMenu={() => setMobileNavOpen(true)}
        />

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            aria-label={t.dashboard.closeNavigation}
            onClick={closeMobileNav}
          />
          <div
            className={cn(
              "scheme-light relative flex h-full w-[min(100%,18rem)] flex-col bg-ink shadow-2xl",
            )}
            role="dialog"
            aria-modal="true"
            aria-label={t.dashboard.navigation}
          >
            <button
              type="button"
              className="absolute end-3 top-5.5 z-10 inline-flex size-10 items-center justify-center rounded-xl text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label={t.common.closeMenu}
              autoFocus
              onClick={closeMobileNav}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <DashboardSidebar user={user} onNavigate={closeMobileNav} className="flex-1" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
