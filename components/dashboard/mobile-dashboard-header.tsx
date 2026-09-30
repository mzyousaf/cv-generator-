"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/constants";

type MobileDashboardHeaderProps = {
  onOpenMenu: () => void;
  menuOpen?: boolean;
};

export function MobileDashboardHeader({
  onOpenMenu,
  menuOpen = false,
}: MobileDashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm lg:hidden">
      <Link
        href="/dashboard"
        className="truncate text-base font-semibold text-slate-900"
      >
        {siteConfig.name}
      </Link>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="min-h-9 min-w-9 shrink-0 px-2"
        aria-label="Open navigation menu"
        aria-expanded={menuOpen}
        onClick={onOpenMenu}
      >
        <span aria-hidden="true">☰</span>
      </Button>
    </header>
  );
}
