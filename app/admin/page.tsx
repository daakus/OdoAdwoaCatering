import Link from "next/link";
import { createClient } from "@/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
  const end   = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

  const [
    { count: todayOrders },
    { count: pendingOrders },
    { count: eventBookings },
    recentOrdersRes,
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", start)
      .lt("created_at", end),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("event_bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "enquiry"),
    supabase
      .from("orders")
      .select("id, customer_name, customer_phone, total_ghs, status, payment_method, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  return (
    <main className="bg-stitch-background p-6 pb-24 md:p-12">
      <header className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2rem] text-stitch-secondary">Dashboard</p>
        <h1 className="font-display text-4xl tracking-tight text-stitch-on-background">Admin Overview</h1>
      </header>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <article className="rounded-xl bg-stitch-surface-container-low p-5">
          <p className="text-xs uppercase tracking-widest text-stitch-outline">Orders today</p>
          <p className="mt-2 text-3xl font-bold">{todayOrders ?? 0}</p>
        </article>
        <article className="rounded-xl bg-amber-50 p-5">
          <p className="text-xs uppercase tracking-widest text-amber-700">Pending orders</p>
          <p className="mt-2 text-3xl font-bold text-amber-900">{pendingOrders ?? 0}</p>
        </article>
        <article className="rounded-xl bg-stitch-surface-container-low p-5">
          <p className="text-xs uppercase tracking-widest text-stitch-outline">Event enquiries</p>
          <p className="mt-2 text-3xl font-bold">{eventBookings ?? 0}</p>
        </article>
      </div>

      <section className="rounded-xl bg-stitch-surface-container-low p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent Orders</h2>
          <Link href="/admin/bookings" className="text-sm font-bold text-stitch-primary">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {(recentOrdersRes.data ?? []).length === 0 ? (
            <p className="text-sm text-stitch-on-surface-variant">No orders yet.</p>
          ) : (
            (recentOrdersRes.data ?? []).map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-lg bg-white/70 p-3 dark:bg-stone-900">
                <div>
                  <p className="font-medium">{o.customer_name}</p>
                  <p className="text-xs text-stitch-on-surface-variant">
                    {o.customer_phone} · {new Date(o.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-stitch-primary">GH₵ {Number(o.total_ghs).toFixed(2)}</p>
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    o.status === "pending" ? "text-amber-600" :
                    o.status === "confirmed" ? "text-green-600" : "text-stitch-outline"
                  }`}>{o.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
