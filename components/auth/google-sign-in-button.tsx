"use client";

import { useI18n } from "@/components/i18n/i18n-provider";

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
  label,
}: GoogleSignInButtonProps) {
  const { t } = useI18n();
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
      loadingText={t.auth.redirecting}
      leftIcon={<GoogleIcon className="size-[18px]" />}
      className="font-medium"
    >
      {label ?? t.auth.continueWithGoogle}
    </Button>
  );
}
