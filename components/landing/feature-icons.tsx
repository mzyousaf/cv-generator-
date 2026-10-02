import type { ReactNode } from "react";

type IconProps = { className?: string };

function IconShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-fuchsia-50 text-blue-600 shadow-[0_1px_0_white_inset,0_6px_16px_-8px_rgb(101_66_236/0.5)] ring-1 ring-blue-100 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105 ${className}`.trim()}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

export function TemplateIcon({ className }: IconProps) {
  return (
    <IconShell className={className}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    </IconShell>
  );
}

export function BuilderIcon({ className }: IconProps) {
  return (
    <IconShell className={className}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    </IconShell>
  );
}

export function AiIcon({ className }: IconProps) {
  return (
    <IconShell className={className}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z" />
      </svg>
    </IconShell>
  );
}

export function PdfIcon({ className }: IconProps) {
  return (
    <IconShell className={className}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6M8 13h2a1 1 0 0 1 0 2H8v3M13 13v5M17 13v5M17 16h-2" />
      </svg>
    </IconShell>
  );
}

export function SaveIcon({ className }: IconProps) {
  return (
    <IconShell className={className}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
        <path d="M17 21v-8H7v8M7 3v5h8" />
      </svg>
    </IconShell>
  );
}

export function LayoutsIcon({ className }: IconProps) {
  return (
    <IconShell className={className}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    </IconShell>
  );
}
