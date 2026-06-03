import { AdminPageHeader, AdminEmptyState } from "@/components/admin/admin-shared";
import { BookingApprovalActions, PaymentApprovalActions } from "@/components/admin/approvals-actions";
import { createClient } from "@/supabase/server";

export default async function AdminApprovalsPage() {
  const supabase = await createClient();
  const [{ data: appointments }, { data: payments }] = await Promise.all([
    supabase
      .from("appointments")
      .select("id, start_at, status, profiles!appointments_user_id_fkey(full_name)")
      .in("status", ["awaiting_approval", "pending"])
      .order("start_at", { ascending: true })
      .limit(50),
    supabase
      .from("payments")
      .select("id, created_at, method, reference, verification_status, appointments(start_at)")
      .eq("verification_status", "pending")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);
  const hasData = (appointments?.length ?? 0) > 0 || (payments?.length ?? 0) > 0;

  return (
    <main className="bg-stitch-background p-6 pb-24 md:p-12">
      <AdminPageHeader
        eyebrow="Approvals"
        title="Approval queue"
        description="Review pending requests and keep client confirmations moving."
      />
      {!hasData ? (
        <AdminEmptyState title="No pending approvals" description="Approval queues will appear here when needed." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <section className="space-y-3 rounded-xl bg-stitch-surface-container-low p-4">
            <h2 className="font-semibold">Booking approvals</h2>
            {(appointments ?? []).map((a) => (
              <article key={a.id} className="rounded-lg bg-white/70 p-3 dark:bg-stone-900">
                <p className="font-medium">
                  {(a.profiles as { full_name?: string | null } | null)?.full_name ?? "Customer"}
                </p>
                <p className="text-xs text-stitch-on-surface-variant">{new Date(a.start_at).toLocaleString()}</p>
                <div className="mt-2">
                  <BookingApprovalActions appointmentId={a.id} />
                </div>
              </article>
            ))}
          </section>
          <section className="space-y-3 rounded-xl bg-stitch-surface-container-low p-4">
            <h2 className="font-semibold">Payment approvals</h2>
            {(payments ?? []).map((p) => (
              <article key={p.id} className="rounded-lg bg-white/70 p-3 dark:bg-stone-900">
                <p className="font-medium">{p.method.replace(/_/g, " ")}</p>
                <p className="text-xs text-stitch-on-surface-variant">
                  Ref: {p.reference ?? "—"} · {new Date(p.created_at).toLocaleString()}
                </p>
                <div className="mt-2">
                  <PaymentApprovalActions paymentId={p.id} />
                </div>
              </article>
            ))}
          </section>
        </div>
      )}
    </main>
  );
}
