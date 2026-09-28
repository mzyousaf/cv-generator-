"use client";

import { Suspense, useCallback, useEffect, useId, useRef } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import {
  useAuthModal,
  type AuthModalView,
} from "@/components/landing/auth-modal-context";

function AuthModalPanel({
  view,
  onSwitch,
  onClose,
  titleId,
}: {
  view: AuthModalView;
  onSwitch: (view: AuthModalView) => void;
  onClose: () => void;
  titleId: string;
}) {
  const isLogin = view === "login";

  return (
    <div className="px-6 py-6 sm:px-8">
      <h2
        id={titleId}
        className="text-xl font-semibold tracking-tight text-slate-900"
      >
        {isLogin ? "Sign in to continue" : "Create your free account"}
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        {isLogin
          ? "Access your saved CVs and continue building."
          : "Start building a professional CV in minutes."}
      </p>

      <div className="mt-6">
        {isLogin ? (
          <Suspense
            fallback={
              <p className="text-sm text-slate-500" role="status">
                Loading…
              </p>
            }
          >
            <LoginForm
              idPrefix="modal-login-"
              callbackUrl="/dashboard"
              onSuccess={onClose}
              submitLabel="Login"
            />
          </Suspense>
        ) : (
          <SignupForm
            idPrefix="modal-signup-"
            mode="modal"
            callbackUrl="/dashboard"
            onSuccess={onClose}
            submitLabel="Create account"
          />
        )}
      </div>

      <p className="mt-6 text-center text-sm text-slate-600">
        {isLogin ? (
          <>
            Don&apos;t have an account?{" "}
            <button
              type="button"
              className="font-medium text-blue-700 underline-offset-2 hover:underline"
              onClick={() => onSwitch("signup")}
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              className="font-medium text-blue-700 underline-offset-2 hover:underline"
              onClick={() => onSwitch("login")}
            >
              Log in
            </button>
          </>
        )}
      </p>
    </div>
  );
}

export function AuthModal() {
  const { isOpen, view, closeAuthModal, setView } = useAuthModal();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        closeAuthModal();
      }
    },
    [closeAuthModal],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeAuthModal();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, closeAuthModal]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 sm:items-center"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={closeAuthModal}
          className="absolute right-3 top-3 rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          aria-label="Close dialog"
        >
          <span aria-hidden="true">×</span>
        </button>

        <AuthModalPanel
          view={view}
          onSwitch={setView}
          onClose={closeAuthModal}
          titleId={titleId}
        />
      </div>
    </div>
  );
}
