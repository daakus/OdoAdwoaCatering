"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/home/material-icon";
import { useAdminSearch } from "@/components/admin/admin-search-context";

function searchPlaceholder(pathname: string) {
  if (pathname.startsWith("/admin/services")) return "Search services or categories...";
  if (pathname.startsWith("/admin/customers")) return "Search clients...";
  if (pathname.startsWith("/admin/calendar")) return "Search rituals...";
  return "Search appointments...";
}

export function AdminTopBar(props: {
  displayName: string;
  subtitle?: string;
  avatarUrl?: string | null;
}) {
  const pathname = usePathname();
  const { displayName, subtitle = "Head Curator", avatarUrl } = props;
  const { searchQuery, setSearchQuery } = useAdminSearch();
  const placeholder = searchPlaceholder(pathname);

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-stitch-outline-variant/20 bg-white/80 px-6 shadow-sm shadow-stitch-primary/5 backdrop-blur-md md:px-12 dark:bg-stone-950/80">
      <div className="hidden text-xl font-display text-stone-900 dark:text-stone-100 md:block">
        Odo Adwoa Admin
      </div>
      <div className="mx-0 max-w-md flex-1 md:mx-8">
        <div className="relative flex items-center">
          <MaterialIcon
            name="search"
            size="sm"
            className="pointer-events-none absolute left-4 text-stone-400"
          />
          <input
            type="search"
            aria-label="Search"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border-none bg-stitch-surface-container-low py-2.5 pl-12 pr-4 font-body text-sm text-stitch-on-surface transition-all placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-orange-200 dark:bg-stone-900"
          />
        </div>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <button
          type="button"
          className="text-stone-400 transition-colors hover:text-stitch-primary dark:hover:text-orange-300"
          aria-label="Notifications"
        >
          <MaterialIcon name="notifications" size="sm" />
        </button>
        <div className="hidden items-center gap-3 border-l border-stone-200 pl-4 dark:border-stone-700 sm:flex">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stitch-surface-container font-display text-sm font-bold text-stitch-primary">
              {displayName.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="text-right">
            <p className="text-sm font-bold text-stone-900 dark:text-stone-100">{displayName}</p>
            <p className="signature-label text-[10px] text-stone-400">{subtitle}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
