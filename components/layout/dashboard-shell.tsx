import type { ReactNode } from "react";
import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import type { DashboardNavItem } from "@/lib/navigation/dashboard-nav";

export function DashboardShell(props: {
  children: ReactNode;
  navItems: DashboardNavItem[];
  sidebarTitle: string;
  userEmail?: string | null;
}) {
  const { children, navItems, sidebarTitle, userEmail } = props;

  return (
    <div className="min-h-dvh bg-brand-bg">
      <PublicNavbar />
      <div className="mx-auto flex max-w-7xl">
        <DashboardSidebar items={navItems} title={sidebarTitle} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4 border-b border-brand-border bg-brand-bg-secondary/50 px-4 py-3 sm:px-6">
            <p className="truncate text-sm text-muted-foreground">
              Signed in{userEmail ? ` as ${userEmail}` : ""}
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/">Website</Link>
              </Button>
              <form action={signOut}>
                <Button type="submit" variant="ghost" size="sm">
                  Sign out
                </Button>
              </form>
            </div>
          </div>
          <main className="px-4 py-6 sm:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
