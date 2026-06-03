import type { ReactNode } from "react";
import { CustomerSanctuaryShell } from "@/components/customer/customer-sanctuary-shell";
import { requireRole } from "@/lib/auth/require-role";
import { createClient } from "@/supabase/server";

export default async function CustomerLayout(props: { children: ReactNode }) {
  const { children } = props;
  await requireRole(["customer"], "/customer");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profileRow } = user
    ? await supabase.from("profiles").select("full_name, avatar_url").eq("id", user.id).maybeSingle()
    : { data: null };

  return (
    <CustomerSanctuaryShell
      profile={{
        fullName: profileRow?.full_name ?? null,
        avatarUrl: profileRow?.avatar_url ?? null,
        email: user?.email ?? null,
      }}
    >
      {children}
    </CustomerSanctuaryShell>
  );
}
