"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNavItems } from "@/components/dashboard/dashboard-nav-config";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { siteConfig } from "@/lib/constants";
import { cn } from "@/lib/cn";

export type DashboardSidebarUser = {
  name: string;
  email: string;
  image?: string;
};

type DashboardSidebarProps = {
  user: DashboardSidebarUser;
  onNavigate?: () => void;
  className?: string;
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function DashboardSidebar({
  user,
  onNavigate,
  className,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="border-b border-slate-200 px-5 py-5">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="cursor-pointer text-lg font-semibold tracking-tight text-slate-900 transition-colors hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          {siteConfig.name}
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4" aria-label="Application">
        <ul className="space-y-1">
          {dashboardNavItems.map((item) => {
            const active = item.isActive(pathname);
            const Icon = item.icon;

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                    active
                      ? "bg-blue-50 text-blue-800 ring-1 ring-blue-100"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  <Icon
                    className={cn(
                      "shrink-0",
                      active ? "text-blue-700" : "text-slate-500",
                    )}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3 rounded-lg p-2">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt=""
              className="size-9 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
            />
          ) : (
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-800 ring-1 ring-blue-200/80"
              aria-hidden="true"
            >
              {getInitials(user.name) || "?"}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">
              {user.name}
            </p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
        <div className="mt-2">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
