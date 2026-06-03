"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MaterialIcon } from "@/components/home/material-icon";

const items = [
  { href: "/",       label: "Home",   icon: "home" },
  { href: "/menu",   label: "Menu",   icon: "restaurant_menu" },
  { href: "/events", label: "Events", icon: "celebration" },
  { href: "/order",  label: "Cart",   icon: "shopping_cart" },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-3xl bg-stitch-surface/80 px-4 pb-6 pt-3 shadow-nav-up backdrop-blur-xl md:hidden">
      {items.map((item) => {
        const active =
          item.href === "/menu"   ? pathname.startsWith("/menu") :
          item.href === "/events" ? pathname.startsWith("/events") :
          item.href === "/order"  ? pathname.startsWith("/order") :
          pathname === item.href;
        return (
          <Link key={item.href} href={item.href}
            className={cn(
              "flex flex-col items-center justify-center rounded-2xl px-4 py-1 transition-all duration-300",
              active ? "bg-orange-100 text-orange-900" : "scale-90 text-orange-800/50 hover:bg-orange-50"
            )}>
            <MaterialIcon name={item.icon} filled={active} className={cn(!active && "opacity-80")} />
            <span className="mt-1 font-body text-[10px] uppercase tracking-[0.1rem]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
