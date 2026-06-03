import type { ReactNode } from "react";
import { AdminSanctuaryShell } from "@/components/admin/admin-sanctuary-shell";
import { requireRole } from "@/lib/auth/require-role";
import { createClient } from "@/supabase/server";

export default async function AdminLayout(props: { children: ReactNode }) {
  const { children } = props;
  await requireRole(["admin"], "/admin");
  const supabase = await createClient();
  const u = await supabase.auth.getUser();
  const uid = u.data.user?.id;
  let fullName: string | null = null;
  let avatarUrl: string | null = null;
  if (uid) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", uid)
      .maybeSingle();
    fullName = profile?.full_name ?? null;
    avatarUrl = profile?.avatar_url ?? null;
  }
  const email = u.data.user?.email ?? null;
  const fromEmail =
    email && email.includes("@")
      ? (email.split("@")[0] ?? "").replace(/\./g, " ").trim()
      : "";
  const displayName = fullName?.trim() || fromEmail || "Admin";

  return (
    <AdminSanctuaryShell
      user={{
        email,
        displayName,
        avatarUrl,
      }}
    >
      {children}
    </AdminSanctuaryShell>
  );
}
