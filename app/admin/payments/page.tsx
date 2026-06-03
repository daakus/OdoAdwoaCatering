import { AdminPageHeader, AdminEmptyState } from "@/components/admin/admin-shared";
import { PaymentApprovalActions } from "@/components/admin/approvals-actions";
import { createClient } from "@/supabase/server";

export default async function AdminPaymentsPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("payments")
    .select("id, created_at, method, reference, verification_status, verified_at")
    .order("created_at", { ascending: false })
    .limit(150);

  return (
    <main className="bg-stitch-background p-6 pb-24 md:p-12">
      <AdminPageHeader
        eyebrow="Payments"
        title="Payment verification"
        description="Confirm transaction status and keep appointment settlements accurate."
      />
      {!rows || rows.length === 0 ? (
        <AdminEmptyState title="No payments yet" description="Payment submissions will appear here." />
      ) : (
        <div className="space-y-3">
          {rows.map((p) => (
            <article key={p.id} className="rounded-xl bg-stitch-surface-container-low p-4">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <p className="font-semibold">{p.method.replace(/_/g, " ")}</p>
                  <p className="text-sm text-stitch-on-surface-variant">Reference: {p.reference ?? "—"}</p>
                  <p className="text-xs text-stitch-outline">
                    {new Date(p.created_at).toLocaleString()} · {p.verification_status}
                  </p>
                </div>
                {p.verification_status === "pending" ? <PaymentApprovalActions paymentId={p.id} /> : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
