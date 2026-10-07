"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { useI18n } from "@/components/i18n/i18n-provider";
import { PreferencesMenu, PreferencesPanel } from "@/components/preferences/preferences-menu";
import { GenerateFreeButton } from "@/components/landing/generate-free-button";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/cn";


const navLinkClass =
  "cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/8 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400";

export function LandingNavbar() {
  const { t } = useI18n();
  const navLinks = [
    { href: "#features", label: t.nav.features },
    { href: "#how-it-works", label: t.nav.howItWorks },
    { href: "#templates", label: t.nav.templates },
  ];
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    // The menu is a desktop-hidden overlay; close it if the screen grows past it.
    const desktop = window.matchMedia("(min-width: 64rem)");
    function onDesktopChange(event: MediaQueryListEvent) {
      if (event.matches) {
        setMobileOpen(false);
      }
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onDesktopChange);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onDesktopChange);
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "scheme-light sticky top-0 z-40 border-b transition-colors duration-300",
        scrolled || mobileOpen
          ? "border-white/10 bg-ink/80 backdrop-blur-xl"
          : "border-transparent bg-ink",
      )}
    >
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
        aria-label={t.nav.main}
      >
        <Link
          href="/"
          className="inline-flex min-w-0 shrink-0 cursor-pointer items-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          {/* Below 360px only the mark fits next to the CTA and burger; keep the name for screen readers. */}
          <Logo tone="light" className="max-[359px]:[&_[data-logo-word]]:sr-only" />
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="inline-flex h-10 items-center rounded-full px-3 text-sm font-semibold text-slate-200 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            {t.common.signIn}
          </Link>
          <PreferencesMenu tone="dark" />
          <GenerateFreeButton variant="nav" />
        </div>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <PreferencesMenu tone="dark" className="hidden sm:block" />
          <GenerateFreeButton variant="nav" />
          <button
            type="button"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-expanded={mobileOpen}
            aria-controls={menuId}
            aria-label={mobileOpen ? t.common.closeMenu : t.common.openMenu}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {mobileOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h10" />}
            </svg>
          </button>
        </div>
      </nav>

      {mobileOpen ? (
        <>
          {/* Overlay: floats over the page instead of pushing it down. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-full h-dvh animate-fade-in bg-ink/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div
            id={menuId}
            className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] animate-fade-up overflow-y-auto border-y border-white/10 bg-ink/95 px-4 pb-5 pt-3 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)] backdrop-blur-xl [animation-duration:0.2s] lg:hidden"
          >
            <ul className="space-y-1">
              {[...navLinks, { href: "/login", label: t.common.signIn }].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/8 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <PreferencesPanel className="mt-3 sm:hidden" />
          </div>
        </>
      ) : null}
    </header>
  );
}
