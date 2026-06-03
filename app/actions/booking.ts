"use server";

import { addMinutes, parse } from "date-fns";
import { revalidatePath } from "next/cache";
import { createClient } from "@/supabase/server";

function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v
  );
}

export async function submitBooking(formData: FormData) {
  const serviceIds = String(formData.get("service_ids") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const staffId = String(formData.get("staff_id") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();
  const reference = String(formData.get("payment_reference") ?? "").trim();
  const method = String(formData.get("payment_method") ?? "mtn_momo");
  const screenshot = formData.get("payment_screenshot") as File | null;

  if (serviceIds.length === 0) return { error: "Select at least one service." };
  if (!date || !time) return { error: "Select date and time." };
  if (!reference) return { error: "Payment reference is required." };
  if (!screenshot || screenshot.size === 0) return { error: "Payment screenshot is required." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please log in to complete booking." };

  const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.id).maybeSingle();
  if (!profile?.id) return { error: "Profile not found." };

  const { data: svcRows } = await supabase
    .from("services")
    .select("id,price_ghs,duration_minutes")
    .in("id", serviceIds);
  if (!svcRows || svcRows.length !== serviceIds.length) {
    return { error: "Selected service could not be found. Please choose another service." };
  }

  const totalDuration = svcRows.reduce((a, s) => a + Number(s.duration_minutes || 0), 0);
  const startAt = parse(`${date} ${time}`, "yyyy-MM-dd hh:mm a", new Date());
  const endAt = addMinutes(startAt, totalDuration || 60);

  const normalizedStaffId = staffId && isUuid(staffId) ? staffId : null;

  const { data: appointment, error: apptErr } = await supabase
    .from("appointments")
    .insert({
      user_id: profile.id,
      staff_id: normalizedStaffId,
      start_at: startAt.toISOString(),
      end_at: endAt.toISOString(),
      status: "payment_submitted",
      customer_notes: notes || null,
    })
    .select("id")
    .single();
  if (apptErr || !appointment) return { error: apptErr?.message ?? "Failed to create appointment." };

  const lines = svcRows.map((s) => ({
    appointment_id: appointment.id,
    service_id: s.id,
    price_at_booking: Number(s.price_ghs),
    duration_minutes: s.duration_minutes,
  }));
  const { error: lineErr } = await supabase.from("appointment_services").insert(lines);
  if (lineErr) return { error: lineErr.message };

  const fileExt = screenshot.name.split(".").pop() || "png";
  const path = `${user.id}/${appointment.id}-${Date.now()}.${fileExt}`;
  const bytes = await screenshot.arrayBuffer();
  const { error: uploadErr } = await supabase.storage
    .from("payment-screenshots")
    .upload(path, bytes, { contentType: screenshot.type || "image/png", upsert: false });
  if (uploadErr) return { error: uploadErr.message };

  const { error: payErr } = await supabase.from("payments").insert({
    appointment_id: appointment.id,
    method,
    reference,
    screenshot_path: path,
    verification_status: "pending",
  });
  if (payErr) return { error: payErr.message };

  revalidatePath("/customer");
  revalidatePath("/customer/appointments/upcoming");
  revalidatePath("/admin");
  revalidatePath("/admin/approvals");
  revalidatePath("/admin/payments");
  return { success: true as const, appointmentId: appointment.id };
}

