"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  authErrorClassName,
  authInfoClassName,
  authInputClassName,
  authPrimaryButtonClassName,
} from "@/components/auth/auth-form-styles";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

export type LoginFormProps = {
  callbackUrl?: string;
  idPrefix?: string;
  showRegisteredBanner?: boolean;
  onSuccess?: () => void;
  submitLabel?: string;
};

export function LoginForm({
  callbackUrl: callbackUrlProp,
  idPrefix = "",
  showRegisteredBanner,
  onSuccess,
  submitLabel = "Login",
}: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl =
    callbackUrlProp ?? searchParams.get("callbackUrl") ?? "/dashboard";
  const registered =
    showRegisteredBanner ?? searchParams.get("registered") === "1";

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailId = `${idPrefix}email`;
  const passwordId = `${idPrefix}password`;

  async function handleCredentialsSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    onSuccess?.();
    router.push(result?.url ?? callbackUrl);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {registered ? (
        <p className={authInfoClassName}>
          Account created. Sign in to continue.
        </p>
      ) : null}
      {error ? <p className={authErrorClassName}>{error}</p> : null}

      <form className="space-y-4" onSubmit={handleCredentialsSubmit}>
        <div className="space-y-2">
          <label htmlFor={emailId} className="block text-sm font-medium text-slate-800">
            Email
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            required
            className={authInputClassName}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor={passwordId} className="block text-sm font-medium text-slate-800">
            Password
          </label>
          <input
            id={passwordId}
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={authInputClassName}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={authPrimaryButtonClassName}
        >
          {submitLabel}
        </button>
      </form>

      <div className="relative text-center text-xs uppercase tracking-wide text-slate-500">
        <span className="relative z-10 bg-white px-2">or</span>
        <div
          className="absolute inset-x-0 top-1/2 border-t border-slate-200"
          aria-hidden="true"
        />
      </div>

      <GoogleSignInButton
        callbackUrl={callbackUrl}
        disabled={isSubmitting}
        onStart={() => setError(null)}
      />
    </div>
  );
}
