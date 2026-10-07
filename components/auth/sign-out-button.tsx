"use client";

import { useI18n } from "@/components/i18n/i18n-provider";

import { signOutUserAction } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

export function SignOutButton({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { t } = useI18n();
  return (
    <form action={signOutUserAction}>
      <Button
        type="submit"
        variant={tone === "dark" ? "ghost" : "outline"}
        size="sm"
        fullWidth
        className={
          tone === "dark"
            ? // Same height, border and surface as the preferences pill beside it.
              "min-h-10! border border-white/15 bg-white/5 text-slate-200! hover:bg-white/10 hover:text-white!"
            : undefined
        }
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 4H5.5A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8M13 13.5 16.5 10 13 6.5M16.5 10H8" />
        </svg>
        <span>{t.auth.signOut}</span>
      </Button>
    </form>
  );
}
