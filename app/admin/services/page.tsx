import { AdminServicesView } from "@/components/admin/admin-services-view";
import { createClient } from "@/supabase/server";

type CategoryJoin = { name?: string | null; slug?: string | null };

function categoryName(join: CategoryJoin | CategoryJoin[] | null | undefined): string {
  if (!join) return "General";
  const row = Array.isArray(join) ? join[0] : join;
  return row?.name?.trim() || "General";
}

function categorySlug(join: CategoryJoin | CategoryJoin[] | null | undefined): string {
  if (!join) return "General";
  const row = Array.isArray(join) ? join[0] : join;
  return (row?.slug ?? row?.name ?? "General").trim() || "General";
}

const FALLBACK_CATEGORIES = [
  "General",
  "Kenkey Packages",
  "Proteins & Grills",
  "Sides & Condiments",
  "Local Bar Drinks",
  "Event Catering",
] as const;

export default async function AdminServicesPage() {
  const supabase = await createClient();
  const [{ data: rows }, categoriesRes] = await Promise.all([
    supabase
      .from("services")
      .select("id, name, description, duration_minutes, price_ghs, image_url, is_active, service_categories(name,slug)")
      .order("created_at", { ascending: false }),
    supabase
      .from("service_categories")
      .select("name, is_active, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
  ]);

  const initialServices =
    rows?.map((r) => ({
      id: r.id,
      name: r.name,
      category: categoryName(r.service_categories as CategoryJoin | CategoryJoin[] | null),
      durationMins: r.duration_minutes,
      priceGhs: Number(r.price_ghs),
      description: r.description ?? "",
      imageSrc: r.image_url ?? "",
      imageAlt: r.name,
      isActive: r.is_active,
    })) ?? [];

  const categorySet = new Set<string>();
  const categoryRows =
    categoriesRes.error || !categoriesRes.data || categoriesRes.data.length === 0
      ? []
      : categoriesRes.data;
  for (const c of categoryRows) {
    if (c.name?.trim()) categorySet.add(c.name.trim());
  }
  if (!categorySet.has("General")) categorySet.add("General");
  for (const s of initialServices) {
    if (s.category?.trim()) categorySet.add(s.category.trim());
  }

  const orderedCategories =
    categorySet.size > 0 ? Array.from(categorySet) : [...FALLBACK_CATEGORIES];

  return (
    <AdminServicesView
      initialServices={initialServices}
      serviceCategories={["All Items", ...orderedCategories]}
    />
  );
}
