import type { ReactNode } from "react";
import type { ManageableSectionId } from "@/lib/cv/section-settings";

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
  sectionId: ManageableSectionId | "personal";
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
      return null;
  }
}
