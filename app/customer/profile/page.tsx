import Link from "next/link";
import { createClient } from "@/supabase/server";

export default async function CustomerProfilePage() {
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
      <header className="mb-8">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stitch-secondary">
          Profile
        </span>
        <h1 className="font-headline text-3xl text-orange-900 md:text-4xl">Customer profile</h1>
        <p className="mt-2 max-w-xl text-sm text-stitch-on-surface-variant">
          Live profile data synced from your Supabase account.
        </p>
      </header>

      <div className="rounded-2xl border border-stitch-outline-variant/15 bg-stitch-surface-container-lowest p-6 shadow-sm">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-bold uppercase tracking-widest text-stitch-outline">Full name</dt>
            <dd className="mt-1 text-sm text-stitch-on-surface">{profile?.full_name?.trim() || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-widest text-stitch-outline">Email</dt>
            <dd className="mt-1 text-sm text-stitch-on-surface">{user?.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-widest text-stitch-outline">Phone</dt>
            <dd className="mt-1 text-sm text-stitch-on-surface">{profile?.phone?.trim() || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-widest text-stitch-outline">Avatar URL</dt>
            <dd className="mt-1 break-all text-sm text-stitch-on-surface">
              {profile?.avatar_url?.trim() || "—"}
            </dd>
          </div>
        </dl>

        <div className="mt-6">
          <Link
            href="/customer/settings"
            className="inline-flex rounded-full bg-stitch-primary px-5 py-2 text-sm font-bold text-stitch-on-primary"
          >
            Edit profile settings
          </Link>
        </div>
      </div>
    </div>
  );
}
