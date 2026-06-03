"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/supabase/server";

export interface AdminServiceInput {
  id?: string;
  name: string;
  category: string;
  durationMins: number;
  priceGhs: number;
  description: string;
  imageUrl?: string | null;
  isActive?: boolean;
}

function toSlug(v: string) {
  return v
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, ok: false as const };
  const { data: role } = await supabase.rpc("current_role_slug");
  const isAdmin = role === "admin" || role === "super_admin";
  return isAdmin ? { supabase, ok: true as const } : { supabase, ok: false as const };
}

export async function upsertAdminService(input: AdminServiceInput) {
  const { supabase, ok } = await assertAdmin();
  if (!ok) return { error: "Unauthorized." };

  const name = input.name.trim();
  if (!name) return { error: "Service name is required." };
  if (!Number.isFinite(input.priceGhs) || input.priceGhs < 0) {
    return { error: "Price must be a valid number." };
  }
  if (!Number.isFinite(input.durationMins) || input.durationMins <= 0) {
    return { error: "Duration must be greater than 0." };
  }

  const categoryName = input.category.trim() || "General";
  const serviceSlug = toSlug(name);

  const { data: categories, error: catErr } = await supabase
    .from("service_categories")
    .select("id, name")
    .eq("is_active", true)
    .in("name", [categoryName, "General"]);

  if (catErr) return { error: catErr.message };
  const exact = (categories ?? []).find((c) => c.name === categoryName);
  const general = (categories ?? []).find((c) => c.name === "General");
  const chosen = exact ?? general;
  if (!chosen) {
    return {
      error:
        'No active matching category found. Please ensure "General" exists in service_categories.',
    };
  }

  const payload = {
    category_id: chosen.id,
    name,
    slug: input.id ? undefined : serviceSlug,
    description: input.description.trim() || null,
    duration_minutes: Math.round(input.durationMins),
    price_ghs: input.priceGhs,
    image_url: input.imageUrl?.trim() || null,
    is_active: input.isActive ?? true,
  };

  if (input.id) {
    const { error } = await supabase.from("services").update(payload).eq("id", input.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("services").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/booking");
  return { success: true as const };
}

