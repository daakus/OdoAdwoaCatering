import { notFound } from "next/navigation";
import { CustomerAppointmentManage } from "@/components/customer/customer-appointment-manage";
import { fetchAppointmentForCustomer } from "@/lib/customer/queries";
import { createClient } from "@/supabase/server";

export default async function ManageAppointmentPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const row = await fetchAppointmentForCustomer(supabase, user.id, params.id);
  if (!row) notFound();

  return <CustomerAppointmentManage row={row} />;
}
