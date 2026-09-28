"use client";

import { signIn } from "next-auth/react";
import { authSecondaryButtonClassName } from "@/components/auth/auth-form-styles";

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
  async function handleClick() {
    onStart?.();
    await signIn("google", { callbackUrl });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={authSecondaryButtonClassName}
    >
      {label}
    </button>
  );
}
