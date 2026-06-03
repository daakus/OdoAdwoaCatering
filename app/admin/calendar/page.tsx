import { createClient } from "@/supabase/server";
import { AdminPageHeader, AdminEmptyState } from "@/components/admin/admin-shared";

export default async function AdminCalendarPage() {
  const supabase = await createClient();
  const [ordersRes, eventsRes] = await Promise.all([
    supabase
      .from("orders")
      .select("id, customer_name, customer_phone, total_ghs, status, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("event_bookings")
      .select("id, customer_name, customer_phone, event_type, event_date, event_time, venue, guest_count, status")
      .gte("event_date", new Date().toISOString().slice(0, 10))
      .order("event_date", { ascending: true })
      .limit(30),
  ]);

  const orders = ordersRes.data ?? [];
  const events = eventsRes.data ?? [];

  return (
    <main className="bg-stitch-background p-6 pb-24 md:p-12">
      <AdminPageHeader
        eyebrow="Calendar"
        title="Order & event schedule"
        description="Upcoming event catering dates and recent food orders at a glance."
      />

      <section className="mb-10">
        <h2 className="mb-4 font-semibold text-stitch-on-background">Upcoming Events</h2>
        {events.length === 0 ? (
          <AdminEmptyState title="No upcoming events" description="Confirmed event bookings will appear here." />
        ) : (
          <div className="space-y-3">
            {events.map((e) => (
              <article key={e.id} className="rounded-xl bg-stitch-surface-container-low p-4">
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                  <div>
                    <p className="font-semibold">{e.customer_name}</p>
                    <p className="text-sm text-stitch-on-surface-variant">
                      {e.event_type} · {e.guest_count} guests · {e.venue}
                    </p>
                    <p className="text-xs font-bold text-stitch-primary">
                      {e.event_date} at {e.event_time}
                    </p>
                  </div>
                  <span className="rounded-full bg-stitch-primary-fixed px-3 py-1 text-xs font-bold uppercase text-stitch-primary">
                    {e.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-semibold text-stitch-on-background">Recent Orders</h2>
        {orders.length === 0 ? (
          <AdminEmptyState title="No orders yet" description="Food orders will appear here." />
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <article key={o.id} className="rounded-xl bg-stitch-surface-container-low p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{o.customer_name}</p>
                    <p className="text-sm text-stitch-on-surface-variant">
                      {o.customer_phone} · {new Date(o.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-stitch-primary">GH₵ {Number(o.total_ghs).toFixed(2)}</p>
                    <span className="text-xs uppercase tracking-wider text-stitch-outline">{o.status}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
