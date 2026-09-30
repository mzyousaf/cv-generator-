import Link from "next/link";
import { siteConfig } from "@/lib/constants";
import { GenerateFreeButton } from "@/components/landing/generate-free-button";

const footerLinkClass =
  "cursor-pointer text-slate-600 transition-colors hover:text-slate-900 focus:outline-none focus-visible:underline";

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-lg font-semibold text-slate-900">{siteConfig.name}</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
            {siteConfig.description}
          </p>
          <div className="mt-4">
            <GenerateFreeButton variant="secondary" />
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">Product</p>
          <ul className="mt-3 space-y-2 text-sm">
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
          <p className="text-sm font-semibold text-slate-900">Legal</p>
          <ul className="mt-3 space-y-2 text-sm">
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

      <div className="border-t border-slate-200">
        <p className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500 sm:px-6">
          © {year} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
