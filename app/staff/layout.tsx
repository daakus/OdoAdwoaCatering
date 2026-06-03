import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireRole } from "@/lib/auth/require-role";
import { staffNav } from "@/lib/navigation/dashboard-nav";
import { createClient } from "@/supabase/server";

export default async function StaffLayout(props: { children: ReactNode }) {
  const { children } = props;
  await requireRole(["staff"], "/staff");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <DashboardShell
      navItems={staffNav}
      sidebarTitle="Staff"
      userEmail={user?.email ?? null}
    >
      {children}
    </DashboardShell>
  );
}
