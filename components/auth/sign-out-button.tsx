"use client";

import { signOutUserAction } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <form action={signOutUserAction}>
      <Button type="submit" variant="outline" size="sm" fullWidth>
        Sign out
      </Button>
    </form>
  );
}
