import { createClient } from "@/supabase/server";
import { BookingApprovalActions } from "@/components/admin/approvals-actions";

export default async function AdminCalendarPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("appointments")
    .select("id, start_at, end_at, status, profiles!appointments_user_id_fkey(full_name), staff(display_name)")
    .gte("start_at", new Date().toISOString())
    .order("start_at", { ascending: true })
    .limit(100);

  return (
    <main className="bg-stitch-background p-6 pb-24 md:p-12">
      <h1 className="mb-6 font-display text-3xl">Calendar</h1>
      <div className="space-y-3">
        {(rows ?? []).map((a) => (
          <article key={a.id} className="rounded-xl bg-stitch-surface-container-low p-4">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <p className="font-semibold">
                  {(a.profiles as { full_name?: string | null } | null)?.full_name ?? "Customer"}
                </p>
                <p className="text-sm text-stitch-on-surface-variant">
                  {new Date(a.start_at).toLocaleString()} - {new Date(a.end_at).toLocaleTimeString()}
                </p>
                <p className="text-xs uppercase tracking-wider text-stitch-outline">
                  {(a.staff as { display_name?: string | null } | null)?.display_name ?? "Unassigned"} · {a.status}
                </p>
              </div>
              {a.status === "awaiting_approval" || a.status === "pending" ? <BookingApprovalActions appointmentId={a.id} /> : null}
            </div>
          </article>
        ))}
        {(rows ?? []).length === 0 ? <p className="text-sm text-stitch-on-surface-variant">No appointments found.</p> : null}
      </div>
    </main>
  );
}
