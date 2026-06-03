import { AdminPageHeader, AdminEmptyState } from "@/components/admin/admin-shared";
import { OrderApprovalActions, EventApprovalActions } from "@/components/admin/approvals-actions";
import { createClient } from "@/supabase/server";

function statusBadge(status: string) {
  if (status === "pending" || status === "enquiry") return "text-amber-600 bg-amber-50";
  if (status === "confirmed") return "text-green-700 bg-green-50";
  if (status === "cancelled") return "text-red-600 bg-red-50";
  return "text-stitch-outline bg-stitch-surface-container-low";
}

export default async function AdminApprovalsPage() {
  const supabase = await createClient();
  const [{ data: pendingOrders }, { data: pendingEvents }] = await Promise.all([
    supabase
      .from("orders")
      .select("id, customer_name, customer_phone, total_ghs, payment_method, payment_reference, status, created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(50),
    supabase
      .from("event_bookings")
      .select("id, customer_name, customer_phone, event_type, event_date, guest_count, deposit_amount_ghs, status, created_at")
      .eq("status", "enquiry")
      .order("created_at", { ascending: true })
      .limit(50),
  ]);

  const hasData = (pendingOrders?.length ?? 0) > 0 || (pendingEvents?.length ?? 0) > 0;

  return (
    <main className="bg-stitch-background p-6 pb-24 md:p-12">
      <AdminPageHeader
        eyebrow="Approvals"
        title="Pending approvals"
        description="Confirm pending food orders and event catering enquiries."
      />
      {!hasData ? (
        <AdminEmptyState title="No pending approvals" description="All caught up! New orders and event enquiries will appear here." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <section className="space-y-3">
            <h2 className="font-semibold text-stitch-on-background">
              Pending Orders{" "}
              <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                {pendingOrders?.length ?? 0}
              </span>
            </h2>
            {(pendingOrders ?? []).length === 0 ? (
              <p className="text-sm text-stitch-on-surface-variant">No pending orders.</p>
            ) : (
              (pendingOrders ?? []).map((o) => (
                <article key={o.id} className="rounded-xl bg-stitch-surface-container-low p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{o.customer_name}</p>
                      <p className="text-sm text-stitch-on-surface-variant">{o.customer_phone}</p>
                      <p className="mt-1 text-xs text-stitch-on-surface-variant">
                        Ref: <span className="font-mono font-bold">{o.payment_reference}</span> ·{" "}
                        {o.payment_method.replace(/_/g, " ").toUpperCase()}
                      </p>
                      <p className="text-xs text-stitch-outline">{new Date(o.created_at).toLocaleString()}</p>
                    </div>
                    <p className="shrink-0 font-bold text-stitch-primary">GH₵ {Number(o.total_ghs).toFixed(2)}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`rounded-full px-3 py-0.5 text-xs font-bold uppercase ${statusBadge(o.status)}`}>
                      {o.status}
                    </span>
                    <OrderApprovalActions
                      orderId={o.id}
                      customerName={o.customer_name}
                      customerPhone={o.customer_phone}
                      totalGhs={Number(o.total_ghs)}
                    />
                  </div>
                </article>
              ))
            )}
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold text-stitch-on-background">
              Event Enquiries{" "}
              <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                {pendingEvents?.length ?? 0}
              </span>
            </h2>
            {(pendingEvents ?? []).length === 0 ? (
              <p className="text-sm text-stitch-on-surface-variant">No pending event enquiries.</p>
            ) : (
              (pendingEvents ?? []).map((e) => (
                <article key={e.id} className="rounded-xl bg-stitch-surface-container-low p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{e.customer_name}</p>
                      <p className="text-sm text-stitch-on-surface-variant">{e.customer_phone}</p>
                      <p className="mt-1 text-xs text-stitch-on-surface-variant">
                        {e.event_type} · {e.guest_count} guests · <span className="font-bold">{e.event_date}</span>
                      </p>
                      <p className="text-xs text-stitch-outline">{new Date(e.created_at).toLocaleString()}</p>
                    </div>
                    <p className="shrink-0 font-bold text-stitch-primary">GH₵ {Number(e.deposit_amount_ghs).toFixed(2)}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`rounded-full px-3 py-0.5 text-xs font-bold uppercase ${statusBadge(e.status)}`}>
                      {e.status}
                    </span>
                    <EventApprovalActions
                      eventId={e.id}
                      customerName={e.customer_name}
                      customerPhone={e.customer_phone}
                      eventType={e.event_type}
                      eventDate={e.event_date}
                      guestCount={e.guest_count}
                      depositGhs={Number(e.deposit_amount_ghs)}
                    />
                  </div>
                </article>
              ))
            )}
          </section>
        </div>
      )}
    </main>
  );
}
