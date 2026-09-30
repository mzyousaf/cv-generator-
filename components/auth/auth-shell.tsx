import Link from "next/link";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-slate-50/80 px-4 py-16 sm:px-6">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="text-slate-600">{description}</p>
        </div>
        <Card>
          <CardContent className="p-6 sm:p-8">{children}</CardContent>
        </Card>
        <div className="text-center text-sm text-slate-600">{footer}</div>
      </div>
    </main>
  );
}

type AuthLinkProps = {
  href: string;
  children: ReactNode;
};

export function AuthLink({ href, children }: AuthLinkProps) {
  return (
    <Link
      href={href}
      className="cursor-pointer font-semibold text-blue-700 underline-offset-2 transition-colors hover:text-blue-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
    >
      {children}
    </Link>
  );
}
