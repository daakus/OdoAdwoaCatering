"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { DashboardNavItem } from "@/lib/navigation/dashboard-nav";

export function DashboardSidebar(props: {
  items: DashboardNavItem[];
  title: string;
}) {
  const pathname = usePathname();
  const { items, title } = props;
  return (
    <aside className="hidden w-56 shrink-0 border-r border-brand-border bg-brand-bg-secondary lg:block">
      <div className="sticky top-16 space-y-1 p-4">
        <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium",
                active ? "bg-brand-bg text-brand-primary-dark" : "text-brand-text hover:bg-brand-bg/80"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
