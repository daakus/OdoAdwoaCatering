import { CustomerAppointmentList } from "@/components/customer/customer-appointment-list";
import { CustomerAppointmentsSubnav } from "@/components/customer/customer-appointments-subnav";
import { fetchHistoryAppointments } from "@/lib/customer/queries";
import { createClient } from "@/supabase/server";

export default async function AppointmentHistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const items = user ? await fetchHistoryAppointments(supabase, user.id) : [];

  return (
    <div>
      <header className="mb-8">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stitch-secondary">
          Appointments
        </span>
        <h1 className="font-headline text-3xl text-orange-900 md:text-4xl">History</h1>
        <p className="mt-2 max-w-xl text-sm text-stitch-on-surface-variant">
          Past visits and cancelled bookings linked to your profile.
        </p>
      </header>
      <CustomerAppointmentsSubnav active="history" />
      <CustomerAppointmentList
        items={items}
        variant="history"
        emptyMessage="No past appointments yet."
      />
    </div>
  );
}
