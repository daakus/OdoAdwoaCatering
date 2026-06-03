import { MaterialIcon } from "@/components/home/material-icon";
import { fetchCustomerNotifications } from "@/lib/customer/queries";
import { createClient } from "@/supabase/server";

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("en-GH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default async function CustomerNotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const items = user ? await fetchCustomerNotifications(supabase, user.id, 50) : [];

  return (
    <div>
      <header className="mb-8">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stitch-secondary">
          Inbox
        </span>
        <h1 className="font-headline text-3xl text-orange-900 md:text-4xl">Notifications</h1>
        <p className="mt-2 max-w-xl text-sm text-stitch-on-surface-variant">
          Messages stored in the notifications table for your user.
        </p>
      </header>

      {items.length === 0 ? (
        <p className="rounded-2xl bg-stitch-surface-container-low p-10 text-center text-sm text-stitch-on-surface-variant">
          No notifications yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((n) => (
            <li
              key={n.id}
              className="flex gap-4 rounded-2xl border border-stitch-outline-variant/15 bg-stitch-surface-container-lowest p-5"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stitch-primary-fixed/30 text-stitch-primary"
                aria-hidden
              >
                <MaterialIcon name="notifications" className="text-xl" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-bold text-orange-900">{n.title}</h2>
                  {!n.read_at ? (
                    <span className="rounded-full bg-stitch-secondary-container/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-stitch-secondary">
                      Unread
                    </span>
                  ) : null}
                </div>
                {n.body ? <p className="mt-2 text-sm text-stitch-on-surface-variant">{n.body}</p> : null}
                <p className="mt-2 text-xs text-stitch-outline">{formatWhen(n.created_at)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
