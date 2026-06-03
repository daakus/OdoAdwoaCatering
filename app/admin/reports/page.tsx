import { AdminPageHeader, AdminEmptyState } from "@/components/admin/admin-shared";
import { createClient } from "@/supabase/server";

export default async function AdminReportsPage() {
  const supabase = await createClient();
  const [appointmentsCount, customersCount, servicesCount] = await Promise.all([
    supabase.from("appointments").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("services").select("*", { count: "exact", head: true }).eq("is_active", true),
  ]);

  const hasAny =
    (appointmentsCount.count ?? 0) > 0 || (customersCount.count ?? 0) > 0 || (servicesCount.count ?? 0) > 0;

  return (
    <main className="bg-stitch-background p-6 pb-24 md:p-12">
      <AdminPageHeader
        eyebrow="Reports"
        title="Reporting"
        description="Generate operational and financial insights for the sanctuary."
      />
      {!hasAny ? (
        <AdminEmptyState title="No reportable data yet" description="Reports will populate after initial operations." />
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl bg-stitch-surface-container-low p-5">
            <p className="text-xs uppercase tracking-widest text-stitch-outline">Appointments</p>
            <p className="mt-2 text-3xl font-bold">{appointmentsCount.count ?? 0}</p>
          </article>
          <article className="rounded-xl bg-stitch-surface-container-low p-5">
            <p className="text-xs uppercase tracking-widest text-stitch-outline">Customers</p>
            <p className="mt-2 text-3xl font-bold">{customersCount.count ?? 0}</p>
          </article>
          <article className="rounded-xl bg-stitch-surface-container-low p-5">
            <p className="text-xs uppercase tracking-widest text-stitch-outline">Active services</p>
            <p className="mt-2 text-3xl font-bold">{servicesCount.count ?? 0}</p>
          </article>
        </div>
      )}
    </main>
  );
}
