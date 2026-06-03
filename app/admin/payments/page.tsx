import { AdminPageHeader, AdminEmptyState } from "@/components/admin/admin-shared";
import { createClient } from "@/supabase/server";

export default async function AdminPaymentsPage() {
  const supabase = await createClient();
  const [ordersRes, eventsRes] = await Promise.all([
    supabase
      .from("orders")
      .select("id, customer_name, customer_phone, payment_method, payment_reference, total_ghs, status, screenshot_path, created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("event_bookings")
      .select("id, customer_name, customer_phone, payment_method, payment_reference, deposit_amount_ghs, status, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const orders = ordersRes.data ?? [];
  const events = eventsRes.data ?? [];
  const hasData = orders.length > 0 || events.length > 0;

  return (
    <main className="bg-stitch-background p-6 pb-24 md:p-12">
      <AdminPageHeader
        eyebrow="Payments"
        title="Payment records"
        description="MoMo payment references and screenshots for all orders and event deposits."
      />
      {!hasData ? (
        <AdminEmptyState title="No payments yet" description="Payment submissions will appear here once customers place orders." />
      ) : (
        <>
          <section className="mb-10">
            <h2 className="mb-4 font-semibold">Order Payments</h2>
            <div className="space-y-3">
              {orders.map((o) => (
                <article key={o.id} className="rounded-xl bg-stitch-surface-container-low p-4">
                  <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <div>
                      <p className="font-semibold">{o.customer_name} · {o.customer_phone}</p>
                      <p className="text-sm text-stitch-on-surface-variant">
                        Ref: <span className="font-mono font-bold">{o.payment_reference}</span> · {o.payment_method.replace(/_/g, " ").toUpperCase()}
                      </p>
                      <p className="text-xs text-stitch-outline">{new Date(o.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-stitch-primary">GH₵ {Number(o.total_ghs).toFixed(2)}</p>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                        o.status === "pending" ? "bg-amber-50 text-amber-600" :
                        o.status === "confirmed" ? "bg-green-50 text-green-700" : "bg-stitch-surface-container text-stitch-outline"
                      }`}>{o.status}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-semibold">Event Deposits</h2>
            <div className="space-y-3">
              {events.map((e) => (
                <article key={e.id} className="rounded-xl bg-stitch-surface-container-low p-4">
                  <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <div>
                      <p className="font-semibold">{e.customer_name} · {e.customer_phone}</p>
                      <p className="text-sm text-stitch-on-surface-variant">
                        Ref: <span className="font-mono font-bold">{e.payment_reference}</span> · {e.payment_method.replace(/_/g, " ").toUpperCase()}
                      </p>
                      <p className="text-xs text-stitch-outline">{new Date(e.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-stitch-primary">GH₵ {Number(e.deposit_amount_ghs).toFixed(2)} deposit</p>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                        e.status === "enquiry" ? "bg-amber-50 text-amber-600" :
                        e.status === "confirmed" ? "bg-green-50 text-green-700" : "bg-stitch-surface-container text-stitch-outline"
                      }`}>{e.status}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
