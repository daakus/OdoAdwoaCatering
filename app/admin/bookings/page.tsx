import { AdminPageHeader, AdminEmptyState } from "@/components/admin/admin-shared";
import { BookingApprovalActions } from "@/components/admin/approvals-actions";
import { createClient } from "@/supabase/server";

export default async function AdminBookingsPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("appointments")
    .select(
      "id, start_at, end_at, status, profiles!appointments_user_id_fkey(full_name), staff(display_name)"
    )
    .order("start_at", { ascending: true })
    .limit(120);
  return (
    <main className="bg-stitch-background p-6 pb-24 md:p-12">
      <AdminPageHeader
        eyebrow="Bookings"
        title="Booking management"
        description="Track booking flow and monitor confirmations from one place."
      />
      {!rows || rows.length === 0 ? (
        <AdminEmptyState title="No bookings yet" description="Bookings will appear here once customers submit appointments." />
      ) : (
        <div className="space-y-3">
          {rows.map((a) => (
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
                {(a.status === "awaiting_approval" || a.status === "pending") ? (
                  <BookingApprovalActions appointmentId={a.id} />
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
