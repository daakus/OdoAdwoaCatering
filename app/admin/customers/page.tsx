import { createClient } from "@/supabase/server";

export default async function AdminCustomersPage() {
  const supabase = await createClient();
  const { data: customers } = await supabase
    .from("profiles")
    .select("id, full_name, phone, updated_at")
    .order("updated_at", { ascending: false })
    .limit(100);

  return (
    <main className="bg-stitch-background p-6 pb-24 md:p-12">
      <h1 className="mb-6 font-display text-3xl">Customers</h1>
      <div className="space-y-3">
        {(customers ?? []).map((c) => (
          <article key={c.id} className="rounded-xl bg-stitch-surface-container-low p-4">
            <p className="font-semibold">{c.full_name?.trim() || "Unnamed customer"}</p>
            <p className="text-sm text-stitch-on-surface-variant">{c.phone?.trim() || "No phone"}</p>
            <p className="text-xs text-stitch-outline">Updated: {new Date(c.updated_at).toLocaleString()}</p>
          </article>
        ))}
        {(customers ?? []).length === 0 ? <p className="text-sm text-stitch-on-surface-variant">No customer profiles found.</p> : null}
      </div>
    </main>
  );
}
