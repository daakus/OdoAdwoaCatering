import { AdminPageHeader, AdminEmptyState } from "@/components/admin/admin-shared";
import { createClient } from "@/supabase/server";

export default async function AdminRevenuePage() {
  const supabase = await createClient();
  const { data: payments } = await supabase
    .from("payments")
    .select("verification_status, appointments(id, appointment_services(price_at_booking))")
    .eq("verification_status", "verified")
    .limit(500);

  const totals = (payments ?? []).reduce(
    (acc, p) => {
      const appt = p.appointments as
        | { appointment_services?: { price_at_booking?: number | null }[] | null }
        | null;
      const lineTotal = (appt?.appointment_services ?? []).reduce(
        (s, item) => s + Number(item.price_at_booking ?? 0),
        0
      );
      acc.total += lineTotal;
      acc.count += 1;
      return acc;
    },
    { total: 0, count: 0 }
  );

  return (
    <main className="bg-stitch-background p-6 pb-24 md:p-12">
      <AdminPageHeader
        eyebrow="Revenue"
        title="Revenue tracking"
        description="Monitor earnings trends and daily performance at a glance."
      />
      {totals.count === 0 ? (
        <AdminEmptyState title="No verified payments yet" description="Revenue appears after payments are verified." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-xl bg-stitch-surface-container-low p-5">
            <p className="text-xs uppercase tracking-widest text-stitch-outline">Verified transactions</p>
            <p className="mt-2 text-3xl font-bold">{totals.count}</p>
          </article>
          <article className="rounded-xl bg-stitch-surface-container-low p-5">
            <p className="text-xs uppercase tracking-widest text-stitch-outline">Gross verified revenue</p>
            <p className="mt-2 text-3xl font-bold">GHS {totals.total.toFixed(2)}</p>
          </article>
        </div>
      )}
    </main>
  );
}
