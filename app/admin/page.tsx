import Link from "next/link";
import { createClient } from "@/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

  const [{ count: todayBookings }, { count: activeStaff }, paymentsRes, upcomingRes] = await Promise.all([
    supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .gte("start_at", start)
      .lt("start_at", end),
    supabase.from("staff").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase
      .from("payments")
      .select("verification_status")
      .gte("created_at", start)
      .lt("created_at", end),
    supabase
      .from("appointments")
      .select("id, start_at, status, profiles!appointments_user_id_fkey(full_name), staff(display_name)")
      .gte("start_at", new Date().toISOString())
      .order("start_at", { ascending: true })
      .limit(8),
  ]);

  const verifiedToday = (paymentsRes.data ?? []).filter((p) => p.verification_status === "verified").length;

  return (
    <main className="bg-stitch-background p-6 pb-24 md:p-12">
      <header className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2rem] text-stitch-secondary">Dashboard</p>
        <h1 className="font-display text-4xl tracking-tight text-stitch-on-background">Admin overview</h1>
      </header>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <article className="rounded-xl bg-stitch-surface-container-low p-5">
          <p className="text-xs uppercase tracking-widest text-stitch-outline">Bookings today</p>
          <p className="mt-2 text-3xl font-bold">{todayBookings ?? 0}</p>
        </article>
        <article className="rounded-xl bg-stitch-surface-container-low p-5">
          <p className="text-xs uppercase tracking-widest text-stitch-outline">Verified payments today</p>
          <p className="mt-2 text-3xl font-bold">{verifiedToday}</p>
        </article>
        <article className="rounded-xl bg-stitch-surface-container-low p-5">
          <p className="text-xs uppercase tracking-widest text-stitch-outline">Active staff</p>
          <p className="mt-2 text-3xl font-bold">{activeStaff ?? 0}</p>
        </article>
      </div>

      <section className="rounded-xl bg-stitch-surface-container-low p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Upcoming appointments</h2>
          <Link href="/admin/bookings" className="text-sm font-bold text-stitch-primary">
            Open bookings
          </Link>
        </div>
        <div className="space-y-3">
          {(upcomingRes.data ?? []).length === 0 ? (
            <p className="text-sm text-stitch-on-surface-variant">No upcoming appointments.</p>
          ) : (
            (upcomingRes.data ?? []).map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg bg-white/70 p-3 dark:bg-stone-900">
                <div>
                  <p className="font-medium">
                    {(a.profiles as { full_name?: string | null } | null)?.full_name ?? "Customer"}
                  </p>
                  <p className="text-xs text-stitch-on-surface-variant">
                    {new Date(a.start_at).toLocaleString()} ·{" "}
                    {(a.staff as { display_name?: string | null } | null)?.display_name ?? "Unassigned"}
                  </p>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-stitch-outline">{a.status}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
