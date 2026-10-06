"use client";

import { useI18n } from "@/components/i18n/i18n-provider";
import Link from "next/link";
import { siteConfig } from "@/lib/constants";
import { Logo } from "@/components/ui/logo";

const footerLinkClass =
  "inline-flex min-h-10 cursor-pointer items-center md:min-h-0 text-slate-400 transition-colors hover:text-white focus:outline-none focus-visible:underline";

export function LandingFooter() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="scheme-light border-t border-white/5 bg-ink text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo tone="light" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            {t.meta.description}
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{t.footer.product}</p>
          <ul className="mt-2 space-y-0 text-sm md:mt-4 md:space-y-3">
            <li>
              <Link href="#features" className={footerLinkClass}>
                {t.nav.features}
              </Link>
            </li>
            <li>
              <Link href="#templates" className={footerLinkClass}>
                {t.nav.templates}
              </Link>
            </li>
            <li>
              <Link href="#how-it-works" className={footerLinkClass}>
                {t.footer.howItWorks}
              </Link>
            </li>
            <li>
              <Link href="/login" className={footerLinkClass}>
                {t.common.signIn}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{t.footer.legal}</p>
          <ul className="mt-2 space-y-0 text-sm md:mt-4 md:space-y-3">
            <li>
              <Link href="/privacy" className={footerLinkClass}>
                {t.footer.privacy}
              </Link>
            </li>
            <li>
              <Link href="/terms" className={footerLinkClass}>
                {t.footer.terms}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500 sm:px-6">
          © {year} {siteConfig.name}. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
