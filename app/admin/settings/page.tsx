import { AdminPageHeader, AdminEmptyState } from "@/components/admin/admin-shared";
import { upsertSetting } from "@/app/actions/admin";
import { createClient } from "@/supabase/server";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("settings").select("key,value,updated_at").order("key");

  return (
    <main className="bg-stitch-background p-6 pb-24 md:p-12">
      <AdminPageHeader
        eyebrow="Settings"
        title="Settings"
        description="Salon profile, contact info, rules, and system preferences."
      />
      {!settings || settings.length === 0 ? (
        <AdminEmptyState
          title="No settings configured"
          description="Add keys like salon_profile, business_hours, booking_rules, and cancellation_policy."
        />
      ) : (
        <div className="space-y-3">
          {settings.map((s) => (
            <article key={s.key} className="rounded-xl bg-stitch-surface-container-low p-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-bold">{s.key}</h3>
                <span className="text-xs text-stitch-outline">{new Date(s.updated_at).toLocaleString()}</span>
              </div>
              <pre className="mt-2 overflow-auto rounded-lg bg-white p-3 text-xs dark:bg-stone-900">
                {JSON.stringify(s.value, null, 2)}
              </pre>
              <form
                className="mt-3 space-y-2"
                action={async (formData) => {
                  "use server";
                  const key = String(formData.get("key") ?? "").trim();
                  const valueRaw = String(formData.get("value") ?? "").trim();
                  if (!key || !valueRaw) return;
                  try {
                    const value = JSON.parse(valueRaw) as Record<string, unknown>;
                    await upsertSetting(key, value);
                  } catch {
                    return;
                  }
                }}
              >
                <input type="hidden" name="key" value={s.key} />
                <textarea
                  name="value"
                  defaultValue={JSON.stringify(s.value, null, 2)}
                  rows={5}
                  className="w-full rounded-lg border border-stitch-outline-variant bg-stitch-surface p-2 text-xs"
                />
                <button type="submit" className="rounded-full bg-stitch-primary px-4 py-1 text-xs font-bold text-stitch-on-primary">
                  Save
                </button>
              </form>
            </article>
          ))}
        </div>
      )}
      <section className="mt-8 rounded-xl bg-stitch-surface-container-low p-4">
        <h2 className="font-semibold">Create setting</h2>
        <form
          className="mt-3 space-y-2"
          action={async (formData) => {
            "use server";
            const key = String(formData.get("key") ?? "").trim();
            const valueRaw = String(formData.get("value") ?? "").trim();
            if (!key || !valueRaw) return;
            try {
              const value = JSON.parse(valueRaw) as Record<string, unknown>;
              await upsertSetting(key, value);
            } catch {
              return;
            }
          }}
        >
          <input
            name="key"
            placeholder="setting_key"
            className="w-full rounded-lg border border-stitch-outline-variant bg-stitch-surface p-2 text-sm"
          />
          <textarea
            name="value"
            defaultValue='{"enabled": true}'
            rows={4}
            className="w-full rounded-lg border border-stitch-outline-variant bg-stitch-surface p-2 text-sm"
          />
          <button type="submit" className="rounded-full bg-stitch-primary px-4 py-2 text-sm font-bold text-stitch-on-primary">
            Create / Update
          </button>
        </form>
      </section>
    </main>
  );
}
