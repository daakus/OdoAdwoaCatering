import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import type { RoleSlug } from "@/types";

function normalizeRole(role: string | null): RoleSlug | null {
  if (role === "super_admin") return "admin";
  if (role === "admin" || role === "staff" || role === "customer") return role;
  return null;
}

export async function requireRole(allowed: RoleSlug[], nextPath: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  const { data: slugRaw, error } = await supabase.rpc("current_role_slug", {});
  const slug = normalizeRole((slugRaw as string | null) ?? null);

  if (error || !slug || !allowed.includes(slug)) {
    if (slug === "admin") redirect("/admin");
    if (slug === "staff") redirect("/staff");
    redirect("/customer");
  }

  return { user, role: slug };
}
