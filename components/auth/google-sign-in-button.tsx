"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/ui/google-icon";

type GoogleSignInButtonProps = {
  callbackUrl: string;
  disabled?: boolean;
  onStart?: () => void;
  label?: string;
};

export function GoogleSignInButton({
  callbackUrl,
  disabled,
  onStart,
  label = "Continue with Google",
}: GoogleSignInButtonProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  async function handleClick() {
    onStart?.();
    setIsRedirecting(true);
    await signIn("google", { callbackUrl });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="md"
      fullWidth
      onClick={() => void handleClick()}
      disabled={disabled}
      isLoading={isRedirecting}
      loadingText="Redirecting…"
      leftIcon={<GoogleIcon className="size-[18px]" />}
      className="font-medium"
    >
      {label}
    </Button>
  );
}
