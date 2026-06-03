"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/supabase/server";

async function assertAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.rpc("current_role_slug");
  const role = (data as string | null) ?? null;
  if (role !== "admin" && role !== "super_admin") return { supabase, ok: false as const };
  return { supabase, ok: true as const };
}

export async function setAppointmentStatus(appointmentId: string, status: string) {
  const { supabase, ok } = await assertAdmin();
  if (!ok) return { error: "Unauthorized" };
  const { error } = await supabase.from("appointments").update({ status }).eq("id", appointmentId);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/admin/calendar");
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/approvals");
  return { success: true as const };
}

export async function setPaymentVerification(paymentId: string, verification: "verified" | "rejected") {
  const { supabase, ok } = await assertAdmin();
  if (!ok) return { error: "Unauthorized" };
  const { error } = await supabase
    .from("payments")
    .update({ verification_status: verification, verified_at: new Date().toISOString() })
    .eq("id", paymentId);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/admin/payments");
  revalidatePath("/admin/approvals");
  return { success: true as const };
}

export async function setOrderStatus(orderId: string, status: string) {
  const { supabase, ok } = await assertAdmin();
  if (!ok) return { error: "Unauthorized" };
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/approvals");
  revalidatePath("/admin/payments");
  return { success: true as const };
}

export async function setEventStatus(eventId: string, status: string) {
  const { supabase, ok } = await assertAdmin();
  if (!ok) return { error: "Unauthorized" };
  const { error } = await supabase.from("event_bookings").update({ status }).eq("id", eventId);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/approvals");
  return { success: true as const };
}

export async function upsertStaff(form: {
  id?: string;
  display_name: string;
  title?: string;
  bio?: string;
  image_url?: string;
  is_active?: boolean;
}) {
  const { supabase, ok } = await assertAdmin();
  if (!ok) return { error: "Unauthorized" };
  if (!form.display_name.trim()) return { error: "Display name is required." };

  if (form.id) {
    const { error } = await supabase
      .from("staff")
      .update({
        display_name: form.display_name,
        title: form.title?.trim() || null,
        bio: form.bio?.trim() || null,
        image_url: form.image_url?.trim() || null,
        is_active: form.is_active ?? true,
      })
      .eq("id", form.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("staff").insert({
      display_name: form.display_name,
      title: form.title?.trim() || null,
      bio: form.bio?.trim() || null,
      image_url: form.image_url?.trim() || null,
      is_active: form.is_active ?? true,
    });
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/staff");
  return { success: true as const };
}

export async function upsertSetting(key: string, value: Record<string, unknown>) {
  const { supabase, ok } = await assertAdmin();
  if (!ok) return { error: "Unauthorized" };
  const { error } = await supabase.from("settings").upsert({ key, value }, { onConflict: "key" });
  if (error) return { error: error.message };
  revalidatePath("/admin/settings");
  return { success: true as const };
}

