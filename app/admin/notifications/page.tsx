import { AdminPageHeader, AdminEmptyState } from "@/components/admin/admin-shared";
import { createClient } from "@/supabase/server";

export default async function AdminNotificationsPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("notifications")
    .select("id, title, body, read_at, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <main className="bg-stitch-background p-6 pb-24 md:p-12">
      <AdminPageHeader
        eyebrow="Alerts"
        title="Notifications"
        description="Keep up with critical updates across bookings, staff, and payments."
      />
      {!rows || rows.length === 0 ? (
        <AdminEmptyState title="No alerts found" description="Notification feed is currently empty." />
      ) : (
        <div className="space-y-3">
          {rows.map((n) => (
            <article key={n.id} className="rounded-xl bg-stitch-surface-container-low p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{n.title}</p>
                <span className="text-xs uppercase tracking-wider text-stitch-outline">
                  {n.read_at ? "Read" : "Unread"}
                </span>
              </div>
              <p className="mt-1 text-sm text-stitch-on-surface-variant">{n.body ?? "—"}</p>
              <p className="mt-2 text-xs text-stitch-outline">{new Date(n.created_at).toLocaleString()}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
