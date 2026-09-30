"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { siteConfig } from "@/lib/constants";
import { GenerateFreeButton } from "@/components/landing/generate-free-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#templates", label: "Templates" },
];

const navLinkClass =
  "cursor-pointer rounded-md px-1 py-0.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2";

export function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
        aria-label="Main"
      >
        <Link
          href="/"
          className="cursor-pointer text-lg font-semibold tracking-tight text-slate-900 transition-colors hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          {siteConfig.name}
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass}>
              {link.label}
            </Link>
          ))}
          <GenerateFreeButton variant="nav" />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <GenerateFreeButton variant="nav" />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-9 min-w-9 px-2 lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls={menuId}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span aria-hidden="true">{mobileOpen ? "✕" : "☰"}</span>
          </Button>
        </div>
      </nav>

      {mobileOpen ? (
        <div
          id={menuId}
          className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden"
        >
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
