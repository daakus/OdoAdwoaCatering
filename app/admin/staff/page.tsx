import { AdminPageHeader, AdminEmptyState, AdminStatusBadge } from "@/components/admin/admin-shared";
import { upsertStaff } from "@/app/actions/admin";
import { createClient } from "@/supabase/server";

export default async function AdminStaffPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("staff")
    .select("id,display_name,title,is_active,updated_at")
    .order("display_name", { ascending: true });

  return (
    <main className="bg-stitch-background p-6 pb-24 md:p-12">
      <AdminPageHeader
        eyebrow="Staff"
        title="Staff management"
        description="Manage stylists, aestheticians, and their active status."
      />
      {!rows || rows.length === 0 ? (
        <AdminEmptyState title="No staff records" description="Create staff rows to manage assignments." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {rows.map((s) => (
            <article key={s.id} className="rounded-xl bg-stitch-surface-container-low p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold">{s.display_name}</h3>
                  <p className="text-sm text-stitch-on-surface-variant">{s.title ?? "Staff member"}</p>
                </div>
                <AdminStatusBadge status={s.is_active ? "active" : "inactive"} />
              </div>
              <form
                className="mt-3 grid gap-2"
                action={async (formData) => {
                  "use server";
                  await upsertStaff({
                    id: String(formData.get("id") ?? ""),
                    display_name: String(formData.get("display_name") ?? ""),
                    title: String(formData.get("title") ?? ""),
                    is_active: String(formData.get("is_active") ?? "") === "true",
                  });
                }}
              >
                <input type="hidden" name="id" value={s.id} />
                <input
                  name="display_name"
                  defaultValue={s.display_name}
                  className="rounded-lg border border-stitch-outline-variant bg-stitch-surface p-2 text-sm"
                />
                <input
                  name="title"
                  defaultValue={s.title ?? ""}
                  className="rounded-lg border border-stitch-outline-variant bg-stitch-surface p-2 text-sm"
                />
                <select
                  name="is_active"
                  defaultValue={String(Boolean(s.is_active))}
                  className="rounded-lg border border-stitch-outline-variant bg-stitch-surface p-2 text-sm"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
                <button type="submit" className="rounded-full bg-stitch-primary px-4 py-1 text-xs font-bold text-stitch-on-primary">
                  Save
                </button>
              </form>
            </article>
          ))}
        </div>
      )}
      <section className="mt-8 rounded-xl bg-stitch-surface-container-low p-4">
        <h2 className="font-semibold">Add staff</h2>
        <form
          className="mt-3 grid gap-2 md:max-w-md"
          action={async (formData) => {
            "use server";
            await upsertStaff({
              display_name: String(formData.get("display_name") ?? ""),
              title: String(formData.get("title") ?? ""),
              is_active: String(formData.get("is_active") ?? "") !== "false",
            });
          }}
        >
          <input
            name="display_name"
            placeholder="Display name"
            className="rounded-lg border border-stitch-outline-variant bg-stitch-surface p-2 text-sm"
          />
          <input
            name="title"
            placeholder="Role / title"
            className="rounded-lg border border-stitch-outline-variant bg-stitch-surface p-2 text-sm"
          />
          <select
            name="is_active"
            defaultValue="true"
            className="rounded-lg border border-stitch-outline-variant bg-stitch-surface p-2 text-sm"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <button type="submit" className="rounded-full bg-stitch-primary px-4 py-2 text-sm font-bold text-stitch-on-primary">
            Create staff
          </button>
        </form>
      </section>
    </main>
  );
}
