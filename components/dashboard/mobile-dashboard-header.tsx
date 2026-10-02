"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";

type MobileDashboardHeaderProps = {
  onOpenMenu: () => void;
  menuOpen?: boolean;
};

export function MobileDashboardHeader({
  onOpenMenu,
  menuOpen = false,
}: MobileDashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 bg-ink/95 px-4 backdrop-blur-xl lg:hidden">
      <Link href="/dashboard" className="min-w-0 truncate rounded-lg">
        <Logo tone="light" />
      </Link>
      <button
        type="button"
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        aria-label="Open navigation menu"
        aria-expanded={menuOpen}
        onClick={onOpenMenu}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M4 7h16M4 12h16M4 17h10" />
        </svg>
      </button>
    </header>
  );
}
