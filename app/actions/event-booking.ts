"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/supabase/server";

export async function submitEventBooking(formData: FormData) {
  const customerName  = String(formData.get("customer_name") ?? "").trim();
  const customerPhone = String(formData.get("customer_phone") ?? "").trim();
  const customerEmail = String(formData.get("customer_email") ?? "").trim();
  const eventType     = String(formData.get("event_type") ?? "").trim();
  const eventDate     = String(formData.get("event_date") ?? "").trim();
  const eventTime     = String(formData.get("event_time") ?? "").trim();
  const venue         = String(formData.get("venue") ?? "").trim();
  const guestCount    = parseInt(String(formData.get("guest_count") ?? "0"), 10);
  const packagesRaw   = String(formData.get("selected_packages") ?? "[]");
  const depositAmount = parseFloat(String(formData.get("deposit_amount") ?? "0"));
  const method        = String(formData.get("payment_method") ?? "mtn_momo");
  const reference     = String(formData.get("payment_reference") ?? "").trim();
  const notes         = String(formData.get("notes") ?? "").trim();
  const screenshot    = formData.get("payment_screenshot") as File | null;

  if (!customerName)  return { error: "Customer name is required." };
  if (!customerPhone) return { error: "Phone number is required." };
  if (!eventType)     return { error: "Event type is required." };
  if (!eventDate)     return { error: "Event date is required." };
  if (!eventTime)     return { error: "Event time is required." };
  if (!venue)         return { error: "Venue / location is required." };
  if (!guestCount || guestCount < 1) return { error: "Guest count must be at least 1." };
  if (!reference)     return { error: "Payment reference is required." };
  if (!screenshot || screenshot.size === 0)
    return { error: "Proof of payment screenshot is required." };

  let selectedPackages: string[];
  try {
    selectedPackages = JSON.parse(packagesRaw) as string[];
  } catch {
    selectedPackages = [];
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const fileExt  = screenshot.name.split(".").pop() || "png";
  const filePath = `events/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  const bytes    = await screenshot.arrayBuffer();
  const { error: uploadErr } = await supabase.storage
    .from("payment-screenshots")
    .upload(filePath, bytes, { contentType: screenshot.type || "image/png", upsert: false });
  if (uploadErr) return { error: uploadErr.message };

  const { data: urlData } = supabase.storage
    .from("payment-screenshots")
    .getPublicUrl(filePath);
  const receiptUrl = urlData?.publicUrl ?? "";

  const { data: booking, error: bookingErr } = await supabase
    .from("event_bookings")
    .insert({
      user_id:            user?.id ?? null,
      customer_name:      customerName,
      customer_phone:     customerPhone,
      customer_email:     customerEmail || null,
      event_type:         eventType,
      event_date:         eventDate,
      event_time:         eventTime,
      venue,
      guest_count:        guestCount,
      selected_packages:  selectedPackages,
      deposit_amount_ghs: depositAmount,
      payment_method:     method,
      payment_reference:  reference,
      screenshot_path:    filePath,
      notes:              notes || null,
    })
    .select("id")
    .single();

  if (bookingErr || !booking)
    return { error: bookingErr?.message ?? "Failed to save event booking." };

  revalidatePath("/customer");
  revalidatePath("/admin");

  return { success: true as const, bookingId: booking.id, receiptUrl };
}
