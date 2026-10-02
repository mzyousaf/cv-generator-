import { ResumesNavIcon } from "@/components/dashboard/icons";
import type { ComponentType } from "react";

export type DashboardNavItem = {
  id: string;
  labelKey: "navResumes";
  href: string;
  icon: ComponentType<{ className?: string }>;
  isActive: (pathname: string) => boolean;
};

export const dashboardNavItems: DashboardNavItem[] = [
  {
    id: "resumes",
    labelKey: "navResumes",
    href: "/dashboard",
    icon: ResumesNavIcon,
    isActive: (pathname) => pathname === "/dashboard",
  },
];
