"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { upsertAdminService } from "@/app/actions/admin-services";
import { useAdminSearch } from "@/components/admin/admin-search-context";
import { MaterialIcon } from "@/components/home/material-icon";
import { cn } from "@/lib/utils";

export interface AdminServiceRecord {
  id: string;
  name: string;
  category: string;
  durationMins: number;
  priceGhs: number;
  description: string;
  imageSrc: string;
  imageAlt: string;
  isActive: boolean;
}

const emptyDraft: AdminServiceRecord = {
  id: "new",
  name: "",
  category: "General",
  durationMins: 60,
  priceGhs: 0,
  description: "",
  imageSrc: "",
  imageAlt: "",
  isActive: true,
};

function formatGhs(n: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export function AdminServicesView(props: {
  initialServices: AdminServiceRecord[];
  serviceCategories: string[];
}) {
  const { initialServices, serviceCategories } = props;
  const router = useRouter();
  const { searchQuery: query } = useAdminSearch();
  const [category, setCategory] = useState<string>("All Services");
  const [gridView, setGridView] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [draft, setDraft] = useState<AdminServiceRecord>(emptyDraft);
  const [services, setServices] = useState<AdminServiceRecord[]>(initialServices);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Sync local state when server re-fetches after router.refresh()
  useEffect(() => {
    setServices(initialServices);
  }, [initialServices]);

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const catOk = category === "All Services" || s.category === category;
      const q = query.trim().toLowerCase();
      const textOk =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q);
      return catOk && textOk;
    });
  }, [category, query, services]);

  const avgValue =
    services.length > 0
      ? services.reduce((acc, s) => acc + s.priceGhs, 0) / services.length
      : 0;

  function openEdit(s: AdminServiceRecord) {
    setDraft({ ...s });
    setSaveError(null);
    setDrawerOpen(true);
  }

  function openNew() {
    setDraft({ ...emptyDraft, imageSrc: services[0]?.imageSrc ?? "" });
    setSaveError(null);
    setDrawerOpen(true);
  }

  return (
    <>
      <main className="min-h-screen overflow-x-hidden bg-stitch-background p-6 pb-24 md:p-12 dark:bg-stone-950">
        <section className="mb-10 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="mb-4 font-display text-4xl leading-tight tracking-tight text-stitch-on-background md:text-5xl">
              Menu Management
            </h2>
            <p className="text-lg font-light leading-relaxed text-stitch-tertiary">
              Manage your food menu items, prices, and categories.
            </p>
          </div>
          <button
            type="button"
            onClick={openNew}
            className="flex h-14 items-center gap-3 rounded-full bg-stitch-primary px-8 font-bold text-stitch-on-primary shadow-xl shadow-stitch-primary/10 transition-all hover:scale-105"
          >
            <MaterialIcon name="auto_awesome" size="sm" className="text-stitch-on-primary" />
            Add New Service
          </button>
        </section>

        <section className="mb-10 grid grid-cols-1 gap-6 md:mb-16 md:grid-cols-12">
          <div className="relative flex items-end overflow-hidden rounded-xl bg-stitch-surface-container-low p-8 md:col-span-8">
            <div className="relative z-10">
              <p className="signature-label mb-2 text-xs text-stitch-secondary">Menu Overview</p>
              <h3 className="font-display text-3xl text-stitch-on-background md:text-4xl">
                {services.length} Active Menu Items
              </h3>
            </div>
            <div className="absolute right-0 top-0 flex h-full w-1/3 items-center justify-center bg-gradient-to-l from-stitch-primary/5 to-transparent">
              <MaterialIcon
                name="brush"
                className="text-8xl text-stitch-primary/10"
                size="xl"
              />
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-xl bg-stitch-surface-container-lowest p-8 transition-colors duration-500 group-hover:bg-stitch-primary-fixed dark:bg-white dark:group-hover:bg-stitch-primary-fixed md:col-span-4">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stitch-secondary-fixed">
                <MaterialIcon
                  name="trending_up"
                  size="sm"
                  className="text-stitch-on-secondary-container"
                />
              </div>
              <span className="text-xs font-bold text-stitch-secondary">+12%</span>
            </div>
            <div>
              <p className="mb-1 text-sm text-stone-500">Average Service Value</p>
              <p className="font-display text-2xl text-stitch-on-background">{formatGhs(avgValue)}</p>
            </div>
          </div>
        </section>

        <div className="space-y-4">
          <div className="no-scrollbar mb-8 flex items-center gap-6 overflow-x-auto pb-2 md:gap-8">
            {serviceCategories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  "shrink-0 pb-1 transition-colors",
                  c === category
                    ? "border-b-2 border-stitch-primary font-bold text-stitch-primary"
                    : "text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
                )}
              >
                {c}
              </button>
            ))}
            <div className="ml-auto hidden items-center gap-4 sm:flex">
              <button
                type="button"
                onClick={() => setGridView(false)}
                className={cn(!gridView ? "text-stitch-primary" : "cursor-pointer text-stone-400")}
                aria-label="List view"
              >
                <MaterialIcon name="view_list" size="sm" />
              </button>
              <button
                type="button"
                onClick={() => setGridView(true)}
                className={cn(gridView ? "text-stitch-primary" : "cursor-pointer text-stone-400")}
                aria-label="Grid view"
              >
                <MaterialIcon name="grid_view" size="sm" />
              </button>
            </div>
          </div>

          <div
            className={cn(
              gridView
                ? "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                : "flex flex-col gap-4"
            )}
          >
            {filtered.map((s) =>
              gridView ? (
                <article
                  key={s.id}
                  className="group rounded-xl bg-stitch-surface-container-lowest p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-stitch-primary/5 dark:bg-white/95"
                >
                  <div className="relative mb-6 h-48 overflow-hidden rounded-lg bg-stone-100">
                    {s.imageSrc ? (
                      <Image
                        src={s.imageSrc}
                        alt={s.imageAlt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-stone-400">
                        <MaterialIcon name="spa" className="text-3xl" size="lg" />
                      </div>
                    )}
                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] text-stitch-on-background backdrop-blur signature-label">
                      {s.category}
                    </div>
                  </div>
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h4 className="mb-1 font-display text-xl text-stitch-on-background">{s.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-stone-400">
                        <MaterialIcon name="schedule" className="!text-base" size="sm" />
                        <span>{s.durationMins} mins</span>
                      </div>
                    </div>
                    <p className="font-display text-xl text-stitch-primary">{formatGhs(s.priceGhs)}</p>
                  </div>
                  <p className="mb-6 line-clamp-2 text-sm font-light text-stone-500">{s.description}</p>
                  <div className="flex items-center gap-3 border-t border-stone-100 pt-6">
                    <button
                      type="button"
                      onClick={() => openEdit(s)}
                      className="signature-label flex flex-1 items-center justify-center gap-2 rounded-full bg-stitch-surface-container-low py-3 text-xs font-bold text-stitch-on-surface transition-colors hover:bg-stone-200"
                    >
                      <MaterialIcon name="edit" className="!text-lg" size="sm" />
                      Edit Details
                    </button>
                    <button
                      type="button"
                      className="flex h-12 w-12 items-center justify-center text-stone-300 transition-colors hover:text-destructive"
                      aria-label="Delete service"
                    >
                      <MaterialIcon name="delete" size="sm" />
                    </button>
                  </div>
                </article>
              ) : (
                <div
                  key={s.id}
                  className="flex flex-col gap-4 rounded-xl border border-stitch-outline-variant/30 bg-stitch-surface-container-lowest p-4 sm:flex-row sm:items-center dark:bg-white/95"
                >
                  <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-32">
                    {s.imageSrc ? (
                      <Image src={s.imageSrc} alt={s.imageAlt} fill className="object-cover" sizes="128px" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-stone-100 text-stone-400">
                        <MaterialIcon name="spa" size="sm" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="signature-label text-[10px] text-stitch-secondary">{s.category}</p>
                    <h4 className="font-display text-lg text-stitch-on-background">{s.name}</h4>
                    <p className="text-sm text-stone-500">{s.durationMins} min</p>
                  </div>
                  <p className="font-display text-lg text-stitch-primary">{formatGhs(s.priceGhs)}</p>
                  <button
                    type="button"
                    onClick={() => openEdit(s)}
                    className="rounded-full bg-stitch-surface-container-low px-4 py-2 text-sm font-semibold text-stitch-on-surface"
                  >
                    Edit
                  </button>
                </div>
              )
            )}

            <button
              type="button"
              onClick={openNew}
              className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-stitch-outline-variant p-6 transition-all duration-300 hover:bg-stitch-surface-container-low md:min-h-[400px]"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-stitch-surface transition-colors group-hover:bg-stitch-primary/10">
                <MaterialIcon
                  name="add_circle"
                  className="text-3xl text-stone-400 group-hover:text-stitch-primary"
                  size="lg"
                />
              </div>
              <p className="mb-2 font-display text-xl text-stone-600">Expand Your Menu</p>
              <p className="max-w-[200px] text-center text-sm font-light text-stone-400">
                Add a new item to your menu.
              </p>
            </button>
          </div>
        </div>
      </main>

      <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/30 transition-opacity md:bg-transparent",
          drawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden={!drawerOpen}
        onClick={() => setDrawerOpen(false)}
      />

      <aside
        className={cn(
          "fixed right-0 top-0 z-[70] h-full w-full max-w-md border-l border-stitch-outline-variant/10 bg-white shadow-2xl transition-transform duration-500 ease-in-out dark:bg-stone-950",
          drawerOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ backgroundImage: "linear-gradient(to bottom, #ffffff, #fdf9f4)" }}
      >
        <div className="h-full overflow-y-auto p-8 dark:bg-stone-950 dark:!bg-none">
          <div className="mb-10 flex items-center justify-between">
            <h3 className="font-display text-2xl text-stitch-on-background">Menu Item</h3>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="text-stone-400 transition-colors hover:text-stitch-on-background"
              aria-label="Close"
            >
              <MaterialIcon name="close" size="sm" />
            </button>
          </div>
          <form
            className="space-y-8"
            onSubmit={async (e) => {
              e.preventDefault();
              setSaving(true);
              setSaveError(null);
              const res = await upsertAdminService({
                id: draft.id === "new" ? undefined : draft.id,
                name: draft.name,
                category: draft.category,
                durationMins: draft.durationMins,
                priceGhs: draft.priceGhs,
                description: draft.description,
                imageUrl: draft.imageSrc || null,
                isActive: draft.isActive,
              });
              setSaving(false);
              if (res?.error) {
                setSaveError(res.error);
                return;
              }
              if (draft.id === "new") {
                setDrawerOpen(false);
                router.refresh();
                return;
              }
              setServices((prev) =>
                prev.map((s) =>
                  s.id === draft.id
                    ? {
                        ...s,
                        name: draft.name,
                        category: draft.category,
                        durationMins: draft.durationMins,
                        priceGhs: draft.priceGhs,
                        description: draft.description,
                        imageSrc: draft.imageSrc,
                        isActive: draft.isActive,
                      }
                    : s
                )
              );
              setDrawerOpen(false);
              router.refresh();
            }}
          >
            <div className="space-y-2">
              <label className="signature-label block text-[10px] text-stitch-secondary">Service Name</label>
              <input
                className="w-full border-b-2 border-stitch-outline-variant bg-transparent py-2 font-display text-xl text-stitch-on-background outline-none focus:border-stitch-primary focus:ring-0"
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="signature-label block text-[10px] text-stitch-secondary">Category</label>
              <select
                className="w-full appearance-none border-b-2 border-stitch-outline-variant bg-transparent py-2 text-lg text-stitch-on-background outline-none focus:border-stitch-primary focus:ring-0"
                value={draft.category}
                onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
              >
                {serviceCategories
                  .filter((c) => c !== "All Services")
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="signature-label block text-[10px] text-stitch-secondary">
                  Duration (mins)
                </label>
                <input
                  type="number"
                  min={15}
                  step={5}
                  className="w-full border-b-2 border-stitch-outline-variant bg-transparent py-2 text-lg outline-none focus:border-stitch-primary focus:ring-0"
                  value={draft.durationMins || ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, durationMins: Number(e.target.value) || 0 }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="signature-label block text-[10px] text-stitch-secondary">
                  Price (GHS)
                </label>
                <input
                  type="number"
                  min={0}
                  className="w-full border-b-2 border-stitch-outline-variant bg-transparent py-2 text-lg outline-none focus:border-stitch-primary focus:ring-0"
                  value={draft.priceGhs || ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, priceGhs: Number(e.target.value) || 0 }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2 pt-4">
              <label className="signature-label block text-[10px] text-stitch-secondary">
                Description
              </label>
              <textarea
                rows={4}
                className="w-full resize-none border-b-2 border-stitch-outline-variant bg-transparent py-2 text-sm font-light leading-relaxed outline-none focus:border-stitch-primary focus:ring-0"
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              />
            </div>
            {saveError ? (
              <p className="text-sm text-red-600 dark:text-red-400">{saveError}</p>
            ) : null}
            <div className="pt-8">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-full bg-stitch-primary py-4 font-bold text-stitch-on-primary shadow-lg shadow-stitch-primary/20 transition-transform hover:scale-[1.02]"
              >
                {saving
                  ? "Saving..."
                  : draft.id === "new"
                    ? "Add Menu Item"
                    : "Update Menu Item"}
              </button>
              {draft.id !== "new" ? (
                <button
                  type="button"
                  className="signature-label mt-2 w-full py-4 text-xs font-bold text-stone-400 transition-colors hover:text-stitch-on-background"
                >
                  Deactivate Item
                </button>
              ) : null}
            </div>
          </form>
        </div>
      </aside>
    </>
  );
}
