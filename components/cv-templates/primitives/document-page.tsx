import type { ReactNode } from "react";

type DocumentPageProps = {
  children: ReactNode;
  className?: string;
};

export function DocumentPage({ children, className = "" }: DocumentPageProps) {
  return (
    <article
      className={`mx-auto min-h-[297mm] w-full max-w-[210mm] bg-white text-zinc-900 shadow-lg ring-1 ring-zinc-200 [overflow-wrap:anywhere] ${className}`}
    >
      {children}
    </article>
  );
}
