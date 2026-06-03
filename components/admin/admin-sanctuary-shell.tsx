"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/app/actions/auth";
import { MaterialIcon } from "@/components/home/material-icon";
import { cn } from "@/lib/utils";
import {
  adminSanctuaryPrimaryNav,
  adminSanctuarySecondaryNav,
} from "@/lib/navigation/admin-sanctuary-nav";
import { AdminTopBar } from "@/components/admin/admin-top-bar";
import { AdminSearchProvider } from "@/components/admin/admin-search-context";

export function AdminSanctuaryShell(props: {
  children: React.ReactNode;
  user: {
    email: string | null;
    displayName: string;
    avatarUrl?: string | null;
  };
}) {
  const { children, user } = props;
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkClass = (active: boolean) =>
    cn(
      "flex items-center gap-4 py-3 pl-5 transition-colors duration-300",
      active
        ? "border-l-4 border-orange-700 bg-orange-50/50 pl-4 font-bold text-orange-900 dark:border-orange-500 dark:bg-orange-900/20 dark:text-orange-200"
        : "text-stone-500 hover:bg-stone-100 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-900 dark:hover:text-stone-200"
    );

  const secondaryActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-screen bg-stitch-background text-stitch-on-background dark:bg-stone-950">
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-stone-50 px-6 py-8 dark:bg-stone-950",
          "transition-transform duration-300 md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="mb-10 px-2">
          <Link href="/admin" className="block" onClick={() => setMobileOpen(false)}>
            <h1 className="font-display text-2xl tracking-tight text-stone-900 dark:text-stone-100">
              Editorial Radiance
            </h1>
            <p className="signature-label mt-1 text-xs text-stone-400 dark:text-stone-500">
              Admin Sanctuary
            </p>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {adminSanctuaryPrimaryNav.map((item) => {
            const active = item.match ? item.match(pathname) : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={navLinkClass(active)}
              >
                <MaterialIcon name={item.icon} size="sm" className="shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-6">
            <p className="signature-label mb-2 px-5 text-[10px] text-stone-400">Operations</p>
            <div className="space-y-0.5">
              {adminSanctuarySecondaryNav.map((item) => {
                const active = secondaryActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg py-2 pl-5 text-sm transition-colors",
                      active
                        ? "bg-stitch-surface-container font-medium text-stitch-primary"
                        : "text-stone-500 hover:bg-stone-100 hover:text-stone-800 dark:hover:bg-stone-900 dark:hover:text-stone-200"
                    )}
                  >
                    <MaterialIcon name={item.icon} size="sm" className="!text-lg shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        <Link
          href="/booking"
          onClick={() => setMobileOpen(false)}
          className="mt-6 flex items-center justify-center gap-2 rounded-full bg-stitch-primary px-6 py-4 font-bold text-stitch-on-primary shadow-lg shadow-stitch-primary/20 transition-all hover:bg-stitch-primary-container"
        >
          <MaterialIcon name="add" size="sm" className="text-stitch-on-primary" />
          Book New Service
        </Link>
        <form action={signOut} className="mt-3">
          <button
            type="submit"
            className="w-full rounded-full border border-stitch-outline-variant px-6 py-3 text-sm font-semibold text-stitch-on-surface transition-colors hover:bg-stitch-surface-container-low"
          >
            Logout
          </button>
        </form>
      </aside>

      <div className="md:ml-72">
        <AdminSearchProvider key={pathname}>
          <div className="flex items-center gap-3 border-b border-stitch-outline-variant/20 bg-stitch-surface px-4 py-3 md:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800"
              aria-label="Open menu"
            >
              <MaterialIcon name="menu" size="sm" />
            </button>
            <span className="font-display text-lg text-stone-900 dark:text-stone-100">Admin</span>
          </div>
          <AdminTopBar displayName={user.displayName} avatarUrl={user.avatarUrl} />
          {children}
        </AdminSearchProvider>
      </div>
    </div>
  );
}
