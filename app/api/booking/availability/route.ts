import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";
import { buildAvailability } from "@/lib/booking/availability";

function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v
  );
}

type StaffWindowRow = { start_time: string; end_time: string };

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  const staffIdRaw = req.nextUrl.searchParams.get("staffId");
  const staffId = staffIdRaw && isUuid(staffIdRaw) ? staffIdRaw : null;
  const durationParam = req.nextUrl.searchParams.get("duration");
  const durationMinutes = Number(durationParam || 60);
  if (!date || !Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  const supabase = await createClient();

  const [{ data: biz }, { data: blocked }] = await Promise.all([
    supabase
      .from("business_settings")
      .select("opening_time,closing_time,slot_interval_minutes,max_days_ahead")
      .maybeSingle(),
    supabase.from("blocked_dates").select("id").eq("date", date).limit(1),
  ]);

  if (blocked && blocked.length > 0) {
    return NextResponse.json({ slots: [] });
  }

  const startOfDay = `${date}T00:00:00`;
  const endOfDay = `${date}T23:59:59`;

  const apptQuery = supabase
    .from("appointments")
    .select("start_at,end_at")
    .gte("start_at", startOfDay)
    .lte("start_at", endOfDay)
    .in("status", [
      "pending_payment",
      "payment_submitted",
      "payment_verified",
      "booking_confirmed",
    ]);
  const staffApptsQuery = staffId ? apptQuery.eq("staff_id", staffId) : apptQuery;

  const emptyStaffWindows: { data: StaffWindowRow[] | null } = { data: null };

  const [appointmentsRes, staffWindowsRes] = await Promise.all([
    staffApptsQuery,
    staffId
      ? supabase
          .from("staff_availability")
          .select("start_time,end_time")
          .eq("staff_id", staffId)
          .eq("is_available", true)
      : Promise.resolve(emptyStaffWindows),
  ]);

  const slots = buildAvailability({
    date,
    openingTime: biz?.opening_time ?? "09:00",
    closingTime: biz?.closing_time ?? "20:00",
    slotIntervalMinutes: biz?.slot_interval_minutes ?? 30,
    durationMinutes,
    existingAppointments: appointmentsRes.data ?? [],
    staffWindows: staffWindowsRes.data ?? undefined,
  });

  return NextResponse.json({ slots });
}
