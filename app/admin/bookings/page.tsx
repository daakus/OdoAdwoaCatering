import { AdminPageHeader, AdminEmptyState } from "@/components/admin/admin-shared";
import { createClient } from "@/supabase/server";

function statusColor(status: string) {
  if (status === "pending" || status === "enquiry") return "text-amber-600 bg-amber-50";
  if (status === "confirmed" || status === "in_progress") return "text-green-700 bg-green-50";
  if (status === "cancelled") return "text-red-600 bg-red-50";
  return "text-stitch-outline bg-stitch-surface-container-low";
}

export default async function AdminBookingsPage() {
  const supabase = await createClient();

  const [ordersRes, eventsRes] = await Promise.all([
    supabase
      .from("orders")
      .select("id, customer_name, customer_phone, customer_email, total_ghs, payment_method, payment_reference, status, created_at")
      .order("created_at", { ascending: false })
      .limit(80),
    supabase
      .from("event_bookings")
      .select("id, customer_name, customer_phone, event_type, event_date, guest_count, deposit_amount_ghs, status, created_at")
      .order("created_at", { ascending: false })
      .limit(40),
  ]);

  const orders = ordersRes.data ?? [];
  const events = eventsRes.data ?? [];

  return (
    <main className="bg-stitch-background p-6 pb-24 md:p-12">
      <AdminPageHeader
        eyebrow="Orders & Bookings"
        title="Order management"
        description="Track food orders and event catering bookings from one place."
      />

      {/* ── Food Orders ── */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-bold text-stitch-on-background">Food Orders</h2>
        {orders.length === 0 ? (
          <AdminEmptyState title="No orders yet" description="Customer orders will appear here once they are placed." />
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <article key={o.id} className="rounded-xl bg-stitch-surface-container-low p-4">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                  <div>
                    <p className="font-semibold">{o.customer_name}</p>
                    <p className="text-sm text-stitch-on-surface-variant">
                      {o.customer_phone}{o.customer_email ? ` · ${o.customer_email}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-stitch-on-surface-variant">
                      Ref: <span className="font-mono font-bold">{o.payment_reference}</span> · {o.payment_method.replace("_", " ").toUpperCase()} · {new Date(o.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-stitch-primary">GH₵ {Number(o.total_ghs).toFixed(2)}</p>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${statusColor(o.status)}`}>
                      {o.status}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ── Event Bookings ── */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-stitch-on-background">Event Catering Enquiries</h2>
        {events.length === 0 ? (
          <AdminEmptyState title="No event bookings yet" description="Event catering enquiries will appear here." />
        ) : (
          <div className="space-y-3">
            {events.map((e) => (
              <article key={e.id} className="rounded-xl bg-stitch-surface-container-low p-4">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                  <div>
                    <p className="font-semibold">{e.customer_name}</p>
                    <p className="text-sm text-stitch-on-surface-variant">
                      {e.customer_phone} · {e.event_type} · {e.guest_count} guests
                    </p>
                    <p className="mt-1 text-xs text-stitch-on-surface-variant">
                      Event date: <span className="font-bold">{e.event_date}</span> · Booked: {new Date(e.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-stitch-primary">GH₵ {Number(e.deposit_amount_ghs).toFixed(2)} deposit</p>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${statusColor(e.status)}`}>
                      {e.status}
                    </span>
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
