"use client";

import { signOutUserAction } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

export function SignOutButton({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <form action={signOutUserAction}>
      <Button
        type="submit"
        variant={tone === "dark" ? "ghost" : "outline"}
        size="sm"
        fullWidth
        className={
          tone === "dark"
            ? "text-slate-400 hover:bg-white/5 hover:text-white"
            : undefined
        }
      >
        Sign out
      </Button>
    </form>
  );
}
