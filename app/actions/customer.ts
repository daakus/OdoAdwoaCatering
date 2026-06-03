"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/supabase/server";

export type CustomerActionState = { error?: string; success?: string };

const initialPath = ["/customer", "/customer/settings", "/customer/favorites"] as const;

function revalidateCustomer() {
  for (const p of initialPath) {
    revalidatePath(p);
  }
}

export async function updateCustomerProfile(
  _prev: CustomerActionState | undefined,
  formData: FormData
): Promise<CustomerActionState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const avatarUrl = String(formData.get("avatar_url") ?? "").trim();

  if (!fullName) {
    return { error: "Name is required." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be signed in." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone: phone || null,
      avatar_url: avatarUrl || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidateCustomer();
  return { success: "Profile updated." };
}

export async function removeFavoriteService(formData: FormData): Promise<void> {
  const serviceId = String(formData.get("service_id") ?? "").trim();
  if (!serviceId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("user_favorite_services")
    .delete()
    .eq("user_id", user.id)
    .eq("service_id", serviceId);

  if (error) return;

  revalidatePath("/customer/favorites");
  revalidatePath("/customer");
}

export async function addFavoriteService(serviceId: string): Promise<CustomerActionState> {
  if (!serviceId) {
    return { error: "Missing service." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be signed in." };
  }

  const { error } = await supabase.from("user_favorite_services").upsert(
    { user_id: user.id, service_id: serviceId },
    { onConflict: "user_id,service_id" }
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/customer/favorites");
  revalidatePath("/customer");
  return { success: "Saved to favorites." };
}
