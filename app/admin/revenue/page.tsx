import { AdminPageHeader, AdminEmptyState } from "@/components/admin/admin-shared";
import { createClient } from "@/supabase/server";

export default async function AdminRevenuePage() {
  const supabase = await createClient();
  const [ordersRes, eventsRes] = await Promise.all([
    supabase
      .from("orders")
      .select("total_ghs, status")
      .limit(1000),
    supabase
      .from("event_bookings")
      .select("deposit_amount_ghs, status")
      .limit(500),
  ]);

  const orders = ordersRes.data ?? [];
  const events = eventsRes.data ?? [];

  const totalOrderRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + Number(o.total_ghs), 0);

  const confirmedOrderRevenue = orders
    .filter((o) => o.status === "confirmed" || o.status === "delivered")
    .reduce((s, o) => s + Number(o.total_ghs), 0);

  const totalDepositRevenue = events
    .filter((e) => e.status !== "cancelled")
    .reduce((s, e) => s + Number(e.deposit_amount_ghs), 0);

  const hasAny = orders.length > 0 || events.length > 0;

  return (
    <main className="bg-stitch-background p-6 pb-24 md:p-12">
      <AdminPageHeader
        eyebrow="Revenue"
        title="Revenue tracking"
        description="Monitor earnings from food orders and event catering deposits."
      />
      {!hasAny ? (
        <AdminEmptyState title="No revenue data yet" description="Revenue appears after customers place orders." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-xl bg-stitch-surface-container-low p-5">
            <p className="text-xs uppercase tracking-widest text-stitch-outline">All order revenue</p>
            <p className="mt-2 text-3xl font-bold">GH₵ {totalOrderRevenue.toFixed(2)}</p>
            <p className="mt-1 text-xs text-stitch-on-surface-variant">{orders.length} orders total</p>
          </article>
          <article className="rounded-xl bg-green-50 p-5">
            <p className="text-xs uppercase tracking-widest text-green-700">Confirmed order revenue</p>
            <p className="mt-2 text-3xl font-bold text-green-900">GH₵ {confirmedOrderRevenue.toFixed(2)}</p>
            <p className="mt-1 text-xs text-green-700">
              {orders.filter((o) => o.status === "confirmed" || o.status === "delivered").length} confirmed
            </p>
          </article>
          <article className="rounded-xl bg-stitch-surface-container-low p-5">
            <p className="text-xs uppercase tracking-widest text-stitch-outline">Event deposits collected</p>
            <p className="mt-2 text-3xl font-bold">GH₵ {totalDepositRevenue.toFixed(2)}</p>
            <p className="mt-1 text-xs text-stitch-on-surface-variant">{events.length} event bookings</p>
          </article>
        </div>
      )}
    </main>
  );
}
