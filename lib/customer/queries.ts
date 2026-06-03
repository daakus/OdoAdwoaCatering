import type { SupabaseClient } from "@supabase/supabase-js";
import { customerAppointmentSelect, upcomingStatuses } from "@/lib/customer/appointments";

type AppointmentServiceRow = {
  service_id: string;
  services: {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
  } | null;
};

export type CustomerAppointmentRow = {
  id: string;
  start_at: string;
  end_at: string;
  status: string;
  staff: { display_name: string } | null;
  appointment_services: AppointmentServiceRow[];
  payments:
    | { verification_status: string; method: string; reference: string | null }
    | { verification_status: string; method: string; reference: string | null }[]
    | null;
};

function firstPayment(
  p: CustomerAppointmentRow["payments"]
): { verification_status: string; method: string; reference: string | null } | null {
  if (!p) return null;
  if (Array.isArray(p)) return p[0] ?? null;
  return p;
}

function serviceNamesFromRow(row: CustomerAppointmentRow): string {
  const names = row.appointment_services
    .map((a) => a.services?.name)
    .filter(Boolean) as string[];
  if (names.length === 0) return "Service";
  if (names.length === 1) return names[0]!;
  return `${names[0]!} +${names.length - 1}`;
}

function primaryImage(row: CustomerAppointmentRow): string | null {
  const first = row.appointment_services.find((a) => a.services?.image_url);
  return first?.services?.image_url ?? null;
}

export type NormalizedAppointment = {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
  serviceName: string;
  serviceImageUrl: string | null;
  stylistName: string | null;
  paymentVerification: string | null;
  paymentMethod: string | null;
  paymentReference: string | null;
};

export function normalizeCustomerAppointment(row: CustomerAppointmentRow): NormalizedAppointment {
  const pay = firstPayment(row.payments);
  return {
    id: row.id,
    startAt: row.start_at,
    endAt: row.end_at,
    status: row.status,
    serviceName: serviceNamesFromRow(row),
    serviceImageUrl: primaryImage(row),
    stylistName: row.staff?.display_name ?? null,
    paymentVerification: pay?.verification_status ?? null,
    paymentMethod: pay?.method ?? null,
    paymentReference: pay?.reference ?? null,
  };
}

function asRows(data: unknown): CustomerAppointmentRow[] {
  if (!data || !Array.isArray(data)) return [];
  return data as CustomerAppointmentRow[];
}

export async function fetchNextUpcomingAppointment(
  supabase: SupabaseClient,
  userId: string
): Promise<NormalizedAppointment | null> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("appointments")
    .select(customerAppointmentSelect)
    .eq("user_id", userId)
    .gte("start_at", now)
    .in("status", [...upcomingStatuses])
    .order("start_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return normalizeCustomerAppointment(data as unknown as CustomerAppointmentRow);
}

export async function fetchRecentPastAppointments(
  supabase: SupabaseClient,
  userId: string,
  limit: number
): Promise<NormalizedAppointment[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("appointments")
    .select(customerAppointmentSelect)
    .eq("user_id", userId)
    .lt("start_at", now)
    .order("start_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return asRows(data).map(normalizeCustomerAppointment);
}

export async function fetchUpcomingAppointments(
  supabase: SupabaseClient,
  userId: string
): Promise<NormalizedAppointment[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("appointments")
    .select(customerAppointmentSelect)
    .eq("user_id", userId)
    .gte("start_at", now)
    .in("status", [...upcomingStatuses])
    .order("start_at", { ascending: true });

  if (error) return [];
  return asRows(data).map(normalizeCustomerAppointment);
}

export async function fetchHistoryAppointments(
  supabase: SupabaseClient,
  userId: string
): Promise<NormalizedAppointment[]> {
  const now = new Date().toISOString();
  const [{ data: past, error: e1 }, { data: voided, error: e2 }] = await Promise.all([
    supabase
      .from("appointments")
      .select(customerAppointmentSelect)
      .eq("user_id", userId)
      .lt("start_at", now)
      .order("start_at", { ascending: false }),
    supabase
      .from("appointments")
      .select(customerAppointmentSelect)
      .eq("user_id", userId)
      .in("status", ["cancelled", "rejected"])
      .gte("start_at", now)
      .order("start_at", { ascending: false }),
  ]);

  if (e1 && e2) return [];
  const byId = new Map<string, CustomerAppointmentRow>();
  for (const row of asRows(past)) byId.set(row.id, row);
  for (const row of asRows(voided)) byId.set(row.id, row);
  return Array.from(byId.values())
    .sort((a, b) => b.start_at.localeCompare(a.start_at))
    .map(normalizeCustomerAppointment);
}

export async function fetchAppointmentForCustomer(
  supabase: SupabaseClient,
  userId: string,
  appointmentId: string
): Promise<CustomerAppointmentRow | null> {
  const { data, error } = await supabase
    .from("appointments")
    .select(customerAppointmentSelect)
    .eq("user_id", userId)
    .eq("id", appointmentId)
    .maybeSingle();

  if (error || !data) return null;
  return data as unknown as CustomerAppointmentRow;
}

export type FavoriteServiceRow = {
  service_id: string;
  created_at: string;
  services: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    duration_minutes: number;
    price_ghs: number;
    image_url: string | null;
  } | null;
};

export async function fetchFavoriteServices(
  supabase: SupabaseClient,
  userId: string
): Promise<FavoriteServiceRow[]> {
  const { data, error } = await supabase
    .from("user_favorite_services")
    .select(
      `
      service_id,
      created_at,
      services (
        id,
        name,
        slug,
        description,
        duration_minutes,
        price_ghs,
        image_url
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as unknown as FavoriteServiceRow[];
}

export type NotificationRow = {
  id: string;
  title: string;
  body: string | null;
  read_at: string | null;
  created_at: string;
};

export async function fetchCustomerNotifications(
  supabase: SupabaseClient,
  userId: string,
  limit: number
): Promise<NotificationRow[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("id, title, body, read_at, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data as NotificationRow[];
}

export async function fetchAllCustomerAppointments(
  supabase: SupabaseClient,
  userId: string,
  limit: number
): Promise<NormalizedAppointment[]> {
  const { data, error } = await supabase
    .from("appointments")
    .select(customerAppointmentSelect)
    .eq("user_id", userId)
    .order("start_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return asRows(data).map(normalizeCustomerAppointment);
}
