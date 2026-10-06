"use client";

import { useI18n } from "@/components/i18n/i18n-provider";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNavItems } from "@/components/dashboard/dashboard-nav-config";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Logo } from "@/components/ui/logo";
import { PreferencesMenu } from "@/components/preferences/preferences-menu";
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
  const { t } = useI18n();

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="px-5 pb-4 pt-6">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="inline-flex cursor-pointer rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <Logo tone="light" />
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4" aria-label={t.dashboard.navLabel}>
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
          {t.dashboard.workspace}
        </p>
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
                    "relative flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
                    active
                      ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] before:absolute before:-start-3 before:top-2 before:bottom-2 before:w-1 before:rounded-e-full before:bg-blue-400"
                      : "text-slate-400 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <Icon
                    className={cn(
                      "shrink-0",
                      active ? "text-blue-300" : "text-slate-500",
                    )}
                  />
                  {t.dashboard[item.labelKey]}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt=""
              className="size-9 shrink-0 rounded-full object-cover ring-2 ring-white/15"
            />
          ) : (
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white ring-2 ring-white/15"
              aria-hidden="true"
            >
              {getInitials(user.name) || "?"}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white" title={user.name}>
              {user.name}
            </p>
            <p className="truncate text-xs text-slate-400" title={user.email}>
              {user.email}
            </p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <PreferencesMenu tone="dark" align="start" placement="top" />
          <div className="flex-1">
            <SignOutButton tone="dark" />
          </div>
        </div>
      </div>
    </div>
  );
}
