import Image from "next/image";
import Link from "next/link";
import { removeFavoriteService } from "@/app/actions/customer";
import { MaterialIcon } from "@/components/home/material-icon";
import { fetchFavoriteServices } from "@/lib/customer/queries";
import { createClient } from "@/supabase/server";

function formatGhs(n: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export default async function FavoritesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const rows = user ? await fetchFavoriteServices(supabase, user.id) : [];

  return (
    <div>
      <header className="mb-8">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stitch-secondary">
          Saved for you
        </span>
        <h1 className="font-headline text-3xl text-orange-900 md:text-4xl">Favorites</h1>
        <p className="mt-2 max-w-xl text-sm text-stitch-on-surface-variant">
          Services you have saved for quick access. Data comes from your account in the database.
        </p>
      </header>

      {rows.length === 0 ? (
        <div className="rounded-2xl bg-stitch-surface-container-low p-10 text-center">
          <p className="text-stitch-on-surface-variant">
            You have not saved any services yet. Browse the catalog and add favorites when that control
            is available on service pages.
          </p>
          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-stitch-primary px-6 py-3 text-sm font-bold text-stitch-on-primary"
          >
            Browse services
          </Link>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2">
          {rows.map((row) => {
            const s = row.services;
            if (!s) return null;
            return (
              <li
                key={row.service_id}
                className="flex flex-col overflow-hidden rounded-2xl border border-stitch-outline-variant/15 bg-stitch-surface-container-lowest shadow-sm"
              >
                <div className="relative h-40 w-full bg-stitch-surface-container-low">
                  {s.image_url ? (
                    <Image src={s.image_url} alt="" fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-stitch-outline">
                      <MaterialIcon name="spa" className="text-4xl" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-headline text-lg text-orange-900">{s.name}</h2>
                  <p className="mt-1 text-xs text-stitch-on-surface-variant line-clamp-2">
                    {s.description ?? "—"}
                  </p>
                  <p className="mt-3 text-sm font-bold text-stitch-primary">
                    {formatGhs(Number(s.price_ghs))} · {s.duration_minutes} min
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href="/booking"
                      className="rounded-full bg-stitch-primary px-4 py-2 text-xs font-bold text-stitch-on-primary"
                    >
                      Book
                    </Link>
                    <form action={removeFavoriteService}>
                      <input type="hidden" name="service_id" value={s.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-stitch-outline-variant px-4 py-2 text-xs font-bold text-stitch-on-surface-variant hover:bg-stitch-surface-container-low"
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
