import { CustomerDashboardHome } from "@/components/customer/customer-dashboard-home";
import {
  fetchNextUpcomingAppointment,
  fetchRecentPastAppointments,
} from "@/lib/customer/queries";
import { createClient } from "@/supabase/server";

export default async function CustomerHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle()
    : { data: null };

  const raw = profile?.full_name?.trim() || user?.email?.split("@")[0] || "there";
  const firstName = raw.includes(" ") ? raw.split(/\s+/)[0]! : raw;

  const upcoming = user ? await fetchNextUpcomingAppointment(supabase, user.id) : null;
  const recentPast = user ? await fetchRecentPastAppointments(supabase, user.id, 4) : [];

  return (
    <CustomerDashboardHome firstName={firstName} upcoming={upcoming} recentPast={recentPast} />
  );
}
