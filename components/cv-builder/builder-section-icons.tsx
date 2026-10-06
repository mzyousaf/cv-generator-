import type { ReactNode } from "react";
import type { BuilderNavKey } from "@/lib/cv/builder-section-nav";

type IconProps = { className?: string };

function IconBase({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function BuilderSectionIcon({
  sectionId,
  className,
}: {
  sectionId: BuilderNavKey;
  className?: string;
}) {
  switch (sectionId) {
    case "personal":
      return (
        <IconBase className={className}>
          <path d="M20 21a8 8 0 0 0-16 0" />
          <circle cx="12" cy="8" r="4" />
        </IconBase>
      );
    case "summary":
      return (
        <IconBase className={className}>
          <path d="M4 6h16M4 12h10M4 18h14" />
        </IconBase>
      );
    case "workExperience":
      return (
        <IconBase className={className}>
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <rect x="3" y="7" width="18" height="13" rx="2" />
        </IconBase>
      );
    case "education":
      return (
        <IconBase className={className}>
          <path d="M3 9l9-5 9 5-9 5-9-5Z" />
          <path d="M21 10v6M6 12.5V17a6 6 0 0 0 12 0v-4.5" />
        </IconBase>
      );
    case "skills":
      return (
        <IconBase className={className}>
          <path d="M12 2l2.4 4.8L20 8l-4 3.9.9 5.5L12 15.8 7.1 17.4 8 11.9 4 8l5.6-1.2L12 2Z" />
        </IconBase>
      );
    case "projects":
      return (
        <IconBase className={className}>
          <path d="M3 7h5l2 3h11v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
        </IconBase>
      );
    case "certifications":
      return (
        <IconBase className={className}>
          <circle cx="12" cy="8" r="5" />
          <path d="M8.5 14 7 22l5-3 5 3-1.5-8" />
        </IconBase>
      );
    case "languages":
      return (
        <IconBase className={className}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
        </IconBase>
      );
    default:
      // Custom sections.
      return (
        <IconBase className={className}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M8 9h8M8 13h8M8 17h5" />
        </IconBase>
      );
  }
}

export function DragHandleIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="9" cy="6" r="1.6" />
      <circle cx="15" cy="6" r="1.6" />
      <circle cx="9" cy="12" r="1.6" />
      <circle cx="15" cy="12" r="1.6" />
      <circle cx="9" cy="18" r="1.6" />
      <circle cx="15" cy="18" r="1.6" />
    </svg>
  );
}

export function EyeIcon({ className, off = false }: IconProps & { off?: boolean }) {
  return (
    <IconBase className={className}>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      {off ? <path d="M4 4l16 16" /> : null}
    </IconBase>
  );
}

export function SparkleIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.8 5.6L19.5 9.5l-5.7 1.9L12 17l-1.8-5.6L4.5 9.5l5.7-1.9L12 2Z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M12 5v14M5 12h14" />
    </IconBase>
  );
}

export function TrashIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
    </IconBase>
  );
}
