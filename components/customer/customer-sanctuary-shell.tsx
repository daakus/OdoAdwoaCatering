"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { signOut } from "@/app/actions/auth";
import { MaterialIcon } from "@/components/home/material-icon";
import { cn } from "@/lib/utils";

export interface CustomerSanctuaryProfile {
  fullName: string | null;
  avatarUrl: string | null;
  email: string | null;
}

const SIDEBAR_NAV: { href: string; label: string; icon: string }[] = [
  { href: "/customer", label: "Overview", icon: "dashboard" },
  { href: "/customer/appointments/upcoming", label: "My Orders", icon: "receipt_long" },
  { href: "/customer/appointments/history", label: "History", icon: "history" },
  { href: "/customer/payments", label: "Payments", icon: "payments" },
  { href: "/customer/notifications", label: "Alerts", icon: "notifications" },
  { href: "/customer/profile", label: "Profile", icon: "person" },
  { href: "/customer/settings", label: "Settings", icon: "settings" },
];

function sidebarActive(pathname: string, href: string) {
  if (href === "/customer") return pathname === "/customer";
  if (href === "/customer/appointments/upcoming") {
    return pathname.includes("/customer/appointments/upcoming");
  }
  if (href === "/customer/appointments/history") {
    return pathname.includes("/customer/appointments/history");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function CustomerSanctuaryShell(props: {
  children: ReactNode;
  profile: CustomerSanctuaryProfile;
}) {
  const { children, profile } = props;
  const pathname = usePathname();
  const displayName =
    profile.fullName?.trim() ||
    profile.email?.split("@")[0] ||
    "Guest";

  return (
    <div className="min-h-dvh bg-stitch-surface text-stitch-on-surface">
      <aside className="fixed z-40 hidden h-screen w-64 flex-col bg-stitch-surface-container-low py-8 pr-4 md:flex">
        <div className="mb-12 px-8">
          <Link href="/" className="font-headline text-2xl italic text-orange-900">
            Odo Adwoa Catering
          </Link>
        </div>
        <nav className="flex-1 space-y-2">
          {SIDEBAR_NAV.map((item) => {
            const active = sidebarActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-r-full px-8 py-3 font-body text-sm tracking-wide transition-transform duration-200 hover:translate-x-1",
                  active
                    ? "bg-orange-100 font-bold text-orange-900"
                    : "text-orange-800/60 hover:bg-orange-50"
                )}
              >
                <MaterialIcon name={item.icon} className="mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-stitch-outline-variant/10 px-8 pt-8">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-stitch-primary-fixed">
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-bold text-stitch-on-primary-fixed">
                  {displayName.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-orange-900">{displayName}</p>
              <p className="text-[10px] uppercase tracking-widest text-orange-800/50">Customer</p>
            </div>
          </div>
          <form action={signOut} className="mt-4">
            <button
              type="submit"
              className="text-xs font-medium text-stitch-outline underline-offset-4 hover:text-stitch-primary hover:underline"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 px-4 py-8 pb-32 md:ml-64 md:px-12 md:pb-12">{children}</main>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-3xl bg-stitch-surface/80 px-4 pb-6 pt-3 shadow-nav-up backdrop-blur-xl md:hidden">
        <Link
          href="/customer"
          className={cn(
            "flex flex-col items-center justify-center rounded-2xl px-4 py-1",
            pathname === "/customer" ? "bg-orange-100 text-orange-900" : "text-orange-800/50"
          )}
        >
          <MaterialIcon name="home" filled={pathname === "/customer"} />
          <span className="mt-1 font-body text-[10px] uppercase tracking-[0.1rem]">Home</span>
        </Link>
        <Link href="/menu" className="flex flex-col items-center justify-center text-orange-800/50">
          <MaterialIcon name="restaurant_menu" />
          <span className="mt-1 font-body text-[10px] uppercase tracking-[0.1rem]">Menu</span>
        </Link>
        <Link href="/events" className="flex flex-col items-center justify-center text-orange-800/50">
          <MaterialIcon name="celebration" />
          <span className="mt-1 font-body text-[10px] uppercase tracking-[0.1rem]">Events</span>
        </Link>
        <Link
          href="/customer/profile"
          className={cn(
            "flex flex-col items-center justify-center rounded-2xl px-4 py-1",
            pathname.startsWith("/customer/profile") ||
              pathname.startsWith("/customer/settings") ||
              pathname.startsWith("/customer/account-settings")
              ? "bg-orange-100 text-orange-900"
              : "text-orange-800/50"
          )}
        >
          <MaterialIcon
            name="person"
            filled={
              pathname.startsWith("/customer/profile") ||
              pathname.startsWith("/customer/settings") ||
              pathname.startsWith("/customer/account-settings")
            }
          />
          <span className="mt-1 font-body text-[10px] uppercase tracking-[0.1rem]">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
