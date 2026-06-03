import { CustomerSettingsForm } from "@/components/customer/customer-settings-form";
import { createClient } from "@/supabase/server";

export default async function CustomerSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("full_name, phone, avatar_url")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };

  return (
    <div>
      <header className="mb-10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stitch-secondary">
          Account
        </span>
        <h1 className="font-headline text-3xl text-orange-900 md:text-4xl">Profile & settings</h1>
        <p className="mt-2 max-w-xl text-sm text-stitch-on-surface-variant">
          Updates are saved to your profile row in Supabase.
        </p>
      </header>
      <CustomerSettingsForm
        defaultFullName={profile?.full_name?.trim() ?? ""}
        defaultPhone={profile?.phone?.trim() ?? ""}
        defaultAvatarUrl={profile?.avatar_url?.trim() ?? ""}
        email={user?.email ?? null}
      />
    </div>
  );
}
