"use client";

import { signIn } from "next-auth/react";
import { useActionState, useEffect, useRef, useState } from "react";
import { registerUser, type RegisterUserState } from "@/lib/auth/actions";
import { useRouter } from "next/navigation";
import {
  authErrorClassName,
  authInputClassName,
  authPrimaryButtonClassName,
} from "@/components/auth/auth-form-styles";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

const initialState: RegisterUserState = {};

export type SignupFormProps = {
  callbackUrl?: string;
  idPrefix?: string;
  onSuccess?: () => void;
  /** After signup on standalone pages, redirect to login. In modal, sign in and go to dashboard. */
  mode?: "page" | "modal";
  submitLabel?: string;
};

export function SignupForm({
  callbackUrl = "/dashboard",
  idPrefix = "",
  onSuccess,
  mode = "page",
  submitLabel = "Create account",
}: SignupFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    registerUser,
    initialState,
  );
  const pendingCredentials = useRef<{ email: string; password: string } | null>(
    null,
  );
  const [oauthBusy, setOauthBusy] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  const nameId = `${idPrefix}name`;
  const emailId = `${idPrefix}email`;
  const passwordId = `${idPrefix}password`;

  useEffect(() => {
    if (!state.success) {
      return;
    }

    if (mode === "page") {
      router.push("/login?registered=1");
      return;
    }

    const credentials = pendingCredentials.current;
    if (!credentials) {
      return;
    }

    let cancelled = false;

    async function completeSignupSignIn() {
      const result = await signIn("credentials", {
        email: credentials!.email,
        password: credentials!.password,
        redirect: false,
        callbackUrl,
      });

      if (cancelled) {
        return;
      }

      if (result?.error) {
        setSignInError(
          "Account created. Please sign in with your email and password.",
        );
        return;
      }

      onSuccess?.();
      router.push(result?.url ?? callbackUrl);
      router.refresh();
    }

    void completeSignupSignIn();

    return () => {
      cancelled = true;
    };
  }, [state.success, mode, router, callbackUrl, onSuccess]);

  function handleFormAction(formData: FormData) {
    setSignInError(null);
    pendingCredentials.current = {
      email: String(formData.get("email") ?? "")
        .trim()
        .toLowerCase(),
      password: String(formData.get("password") ?? ""),
    };
    formAction(formData);
  }

  const busy = isPending || oauthBusy;

  return (
    <div className="space-y-4">
      {state.error ? <p className={authErrorClassName}>{state.error}</p> : null}
      {signInError ? <p className={authErrorClassName}>{signInError}</p> : null}

      <form action={handleFormAction} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor={nameId} className="block text-sm font-medium text-slate-800">
            Name
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            autoComplete="name"
            required
            className={authInputClassName}
          />
        </div>
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
            autoComplete="new-password"
            minLength={8}
            required
            className={authInputClassName}
          />
        </div>
        <button
          type="submit"
          disabled={busy}
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
        disabled={busy}
        onStart={() => {
          setOauthBusy(true);
          setSignInError(null);
        }}
      />
    </div>
  );
}
