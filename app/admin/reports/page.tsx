import { AdminPageHeader, AdminEmptyState } from "@/components/admin/admin-shared";
import { createClient } from "@/supabase/server";

export default async function AdminReportsPage() {
  const supabase = await createClient();
  const [ordersCount, eventsCount, menuCount, customersCount] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("event_bookings").select("*", { count: "exact", head: true }),
    supabase.from("services").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
  ]);

  const hasAny = (ordersCount.count ?? 0) > 0 || (eventsCount.count ?? 0) > 0;

  return (
    <main className="bg-stitch-background p-6 pb-24 md:p-12">
      <AdminPageHeader
        eyebrow="Reports"
        title="Reporting"
        description="Operational summary of orders, events, and menu performance."
      />
      {!hasAny ? (
        <AdminEmptyState title="No data yet" description="Reports will populate after customers start ordering." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-xl bg-stitch-surface-container-low p-5">
            <p className="text-xs uppercase tracking-widest text-stitch-outline">Total orders</p>
            <p className="mt-2 text-3xl font-bold">{ordersCount.count ?? 0}</p>
          </article>
          <article className="rounded-xl bg-stitch-surface-container-low p-5">
            <p className="text-xs uppercase tracking-widest text-stitch-outline">Event bookings</p>
            <p className="mt-2 text-3xl font-bold">{eventsCount.count ?? 0}</p>
          </article>
          <article className="rounded-xl bg-stitch-surface-container-low p-5">
            <p className="text-xs uppercase tracking-widest text-stitch-outline">Active menu items</p>
            <p className="mt-2 text-3xl font-bold">{menuCount.count ?? 0}</p>
          </article>
          <article className="rounded-xl bg-stitch-surface-container-low p-5">
            <p className="text-xs uppercase tracking-widest text-stitch-outline">Registered customers</p>
            <p className="mt-2 text-3xl font-bold">{customersCount.count ?? 0}</p>
          </article>
        </div>
      )}
    </main>
  );
}
