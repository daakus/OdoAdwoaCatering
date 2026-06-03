"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants/site";
import { MaterialIcon } from "@/components/home/material-icon";

const links = [
  { href: "/menu",     label: "Menu" },
  { href: "/events",   label: "Event Catering" },
  { href: "/customer", label: "My Orders" },
] as const;

export interface HomeTopNavProps {
  className?: string;
}

export function HomeTopNav({ className }: HomeTopNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  return (
    <>
      <nav className={cn(
        "fixed top-0 z-50 mx-auto flex w-full max-w-full items-center justify-between gap-4 bg-stitch-surface/80 px-6 py-4 shadow-sm backdrop-blur-md md:px-8",
        className
      )}>
        <Link href="/" className="font-headline text-xl font-bold text-orange-900 transition-opacity hover:opacity-90">
          Odo Adwoa <span className="text-sm font-normal italic">Catering</span>
        </Link>

        <div className="hidden flex-1 justify-center gap-10 font-headline font-medium tracking-tight md:flex">
          {links.map((item) => {
            const active =
              item.href === "/menu"
                ? pathname === "/" || pathname.startsWith("/menu")
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href}
                className={cn("transition-colors duration-300",
                  active ? "border-b-2 border-orange-800 font-bold text-orange-800" : "text-orange-700/70 hover:text-orange-900")}>
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden rounded-full border border-stitch-outline-variant px-4 py-2 text-sm font-semibold text-stitch-on-surface transition-colors hover:bg-stitch-surface-container-low md:inline-flex">
            Sign in
          </Link>
          <Link href="/menu" className="hidden rounded-full bg-stitch-primary px-6 py-2 font-semibold text-stitch-on-primary transition-opacity hover:opacity-90 md:inline-flex md:px-8 md:py-3">
            Order Now 🛒
          </Link>
          <button type="button" className="rounded-lg p-2 text-orange-900 md:hidden"
            aria-expanded={mobileOpen} aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}>
            <MaterialIcon name={mobileOpen ? "close" : "menu"} className="text-2xl" />
          </button>
        </div>
      </nav>

      {mobileOpen ? (
        <>
          <button type="button" className="fixed inset-0 z-40 bg-black/30 md:hidden" aria-label="Close menu" onClick={() => setMobileOpen(false)} />
          <div className="fixed left-0 right-0 top-[4.25rem] z-50 border-b border-stitch-outline-variant/20 bg-stitch-surface px-6 py-6 shadow-lg md:hidden">
            <ul className="flex flex-col gap-4 font-headline font-medium tracking-tight">
              {links.map((item) => {
                const active =
                  item.href === "/menu"
                    ? pathname === "/" || pathname.startsWith("/menu")
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link href={item.href} className={cn("block py-2 transition-colors", active ? "font-bold text-orange-800" : "text-orange-800/80")}>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li><Link href="/login" className="block py-2 text-orange-800/80">Sign in</Link></li>
              <li>
                <Link href="/menu" className="mt-2 block rounded-full bg-stitch-primary py-3 text-center font-semibold text-stitch-on-primary">
                  Order Now 🛒
                </Link>
              </li>
            </ul>
          </div>
        </>
      ) : null}
    </>
  );
}
