import Link from "next/link";
import { siteConfig } from "@/lib/constants";
import { Logo } from "@/components/ui/logo";

const footerLinkClass =
  "cursor-pointer text-slate-400 transition-colors hover:text-white focus:outline-none focus-visible:underline";

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo tone="light" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            {siteConfig.description}
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Product</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link href="#features" className={footerLinkClass}>
                Features
              </Link>
            </li>
            <li>
              <Link href="#templates" className={footerLinkClass}>
                Templates
              </Link>
            </li>
            <li>
              <Link href="#how-it-works" className={footerLinkClass}>
                How it works
              </Link>
            </li>
            <li>
              <Link href="/login" className={footerLinkClass}>
                Sign in
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Legal</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link href="/privacy" className={footerLinkClass}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className={footerLinkClass}>
                Terms &amp; Conditions
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500 sm:px-6">
          © {year} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
