"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/supabase/server";

export interface OrderLineInput {
  itemId: string;
  itemName: string;
  itemPriceGhs: number;
  quantity: number;
}

export interface SubmitOrderResult {
  error?: string;
  success?: true;
  orderId?: string;
  receiptUrl?: string;
  newAccountCreated?: boolean;
}

export async function submitOrder(formData: FormData): Promise<SubmitOrderResult> {
  const customerName  = String(formData.get("customer_name") ?? "").trim();
  const customerPhone = String(formData.get("customer_phone") ?? "").trim();
  const customerEmail = String(formData.get("customer_email") ?? "").trim();
  const notes         = String(formData.get("notes") ?? "").trim();
  const method        = String(formData.get("payment_method") ?? "mtn_momo");
  const reference     = String(formData.get("payment_reference") ?? "").trim();
  const screenshot    = formData.get("payment_screenshot") as File | null;
  const linesRaw      = String(formData.get("lines") ?? "");

  if (!customerName)  return { error: "Customer name is required." };
  if (!customerPhone) return { error: "Phone number is required." };
  if (!reference)     return { error: "Payment reference is required." };
  if (!screenshot || screenshot.size === 0)
    return { error: "Payment screenshot is required." };

  let lines: OrderLineInput[];
  try {
    lines = JSON.parse(linesRaw) as OrderLineInput[];
  } catch {
    return { error: "Invalid order lines." };
  }
  if (!lines.length) return { error: "Your cart is empty." };

  const subtotal = lines.reduce((s, l) => s + l.itemPriceGhs * l.quantity, 0);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // ── Auto-create account if guest provides an email ──────────────────────────
  let userId = user?.id ?? null;
  let newAccountCreated = false;

  if (!user && customerEmail) {
    const { data: signupData, error: signupErr } = await supabase.auth.signUp({
      email: customerEmail,
      password: crypto.randomUUID(), // random password — they'll set it via email link
      options: {
        data: { full_name: customerName, phone: customerPhone },
      },
    });
    if (!signupErr && signupData.user && !signupData.user.identities?.length === false) {
      // identities.length === 0 means email already registered — skip
      userId = signupData.user.id;
      newAccountCreated = true;
    }
  }

  // ── Upload screenshot ────────────────────────────────────────────────────────
  const fileExt  = screenshot.name.split(".").pop() || "png";
  const filePath = `orders/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  const bytes    = await screenshot.arrayBuffer();
  const { error: uploadErr } = await supabase.storage
    .from("payment-screenshots")
    .upload(filePath, bytes, { contentType: screenshot.type || "image/png", upsert: false });
  if (uploadErr) return { error: `Screenshot upload failed: ${uploadErr.message}` };

  const { data: urlData } = supabase.storage
    .from("payment-screenshots")
    .getPublicUrl(filePath);
  const receiptUrl = urlData?.publicUrl ?? "";

  // ── Insert order ─────────────────────────────────────────────────────────────
  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      user_id:           userId,
      customer_name:     customerName,
      customer_phone:    customerPhone,
      customer_email:    customerEmail || null,
      subtotal_ghs:      subtotal,
      total_ghs:         subtotal,
      payment_method:    method,
      payment_reference: reference,
      screenshot_path:   filePath,
      notes:             notes || null,
    })
    .select("id")
    .single();
  if (orderErr || !order) return { error: orderErr?.message ?? "Failed to create order." };

  // ── Insert order items ───────────────────────────────────────────────────────
  const itemRows = lines.map((l) => ({
    order_id:       order.id,
    item_id:        l.itemId,
    item_name:      l.itemName,
    item_price_ghs: l.itemPriceGhs,
    quantity:       l.quantity,
    line_total_ghs: l.itemPriceGhs * l.quantity,
  }));
  const { error: itemsErr } = await supabase.from("order_items").insert(itemRows);
  if (itemsErr) return { error: itemsErr.message };

  revalidatePath("/customer");
  revalidatePath("/admin");

  return { success: true, orderId: order.id, receiptUrl, newAccountCreated };
}
