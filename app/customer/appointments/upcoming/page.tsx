import { CustomerAppointmentList } from "@/components/customer/customer-appointment-list";
import { CustomerAppointmentsSubnav } from "@/components/customer/customer-appointments-subnav";
import { fetchUpcomingAppointments } from "@/lib/customer/queries";
import { createClient } from "@/supabase/server";

export default async function UpcomingAppointmentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const items = user ? await fetchUpcomingAppointments(supabase, user.id) : [];

  return (
    <div>
      <header className="mb-8">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stitch-secondary">
          Appointments
        </span>
        <h1 className="font-headline text-3xl text-orange-900 md:text-4xl">Upcoming</h1>
        <p className="mt-2 max-w-xl text-sm text-stitch-on-surface-variant">
          Confirmed and in-progress bookings from your account.
        </p>
      </header>
      <CustomerAppointmentsSubnav active="upcoming" />
      <CustomerAppointmentList
        items={items}
        variant="upcoming"
        emptyMessage="You have no upcoming appointments. Book a service to see it here."
      />
    </div>
  );
}
