"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  DashboardSidebar,
  type DashboardSidebarUser,
} from "@/components/dashboard/dashboard-sidebar";
import { MobileDashboardHeader } from "@/components/dashboard/mobile-dashboard-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type DashboardShellProps = {
  user: DashboardSidebarUser;
  children: ReactNode;
};

export function DashboardShell({ user, children }: DashboardShellProps) {
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
    <div className="flex min-h-screen min-w-0 bg-slate-50/80">
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <DashboardSidebar user={user} />
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
            className="absolute inset-0 bg-slate-900/50"
            aria-label="Close navigation menu"
            onClick={closeMobileNav}
          />
          <div
            className={cn(
              "relative flex h-full w-[min(100%,18rem)] flex-col bg-white shadow-xl",
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
          >
            <div className="flex items-center justify-end border-b border-slate-200 px-3 py-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="min-h-9 min-w-9 px-2"
                aria-label="Close menu"
                onClick={closeMobileNav}
              >
                <span aria-hidden="true">×</span>
              </Button>
            </div>
            <DashboardSidebar user={user} onNavigate={closeMobileNav} className="flex-1" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
