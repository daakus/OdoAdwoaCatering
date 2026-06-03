import Link from "next/link";
import { fetchHistoryAppointments, fetchUpcomingAppointments } from "@/lib/customer/queries";
import { createClient } from "@/supabase/server";

export default async function CustomerAppointmentsIndexPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [upcoming, history] = user
    ? await Promise.all([
        fetchUpcomingAppointments(supabase, user.id),
        fetchHistoryAppointments(supabase, user.id),
      ])
    : [[], []];

  return (
    <div>
      <header className="mb-8">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stitch-secondary">
          Appointments
        </span>
        <h1 className="font-headline text-3xl text-orange-900 md:text-4xl">Appointment center</h1>
        <p className="mt-2 max-w-xl text-sm text-stitch-on-surface-variant">
          This page is connected to your appointment records in the database.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Link
          href="/customer/appointments/upcoming"
          className="rounded-2xl border border-stitch-outline-variant/15 bg-stitch-surface-container-lowest p-6 shadow-sm transition-colors hover:bg-stitch-surface-container-low"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-stitch-secondary">Upcoming</p>
          <h2 className="mt-2 font-headline text-2xl text-orange-900">{upcoming.length}</h2>
          <p className="mt-2 text-sm text-stitch-on-surface-variant">
            Confirmed and pending bookings that have not happened yet.
          </p>
        </Link>

        <Link
          href="/customer/appointments/history"
          className="rounded-2xl border border-stitch-outline-variant/15 bg-stitch-surface-container-lowest p-6 shadow-sm transition-colors hover:bg-stitch-surface-container-low"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-stitch-secondary">History</p>
          <h2 className="mt-2 font-headline text-2xl text-orange-900">{history.length}</h2>
          <p className="mt-2 text-sm text-stitch-on-surface-variant">
            Past visits and cancelled bookings linked to your account.
          </p>
        </Link>
      </div>
    </div>
  );
}
