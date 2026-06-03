import Link from "next/link";
import { cn } from "@/lib/utils";

export function CustomerAppointmentsSubnav(props: { active: "upcoming" | "history" }) {
  const { active } = props;
  const tabs = [
    { href: "/customer/appointments/upcoming", key: "upcoming" as const, label: "Upcoming" },
    { href: "/customer/appointments/history", key: "history" as const, label: "History" },
  ];

  return (
    <nav className="mb-8 flex gap-2 border-b border-stitch-outline-variant/20 pb-1">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          className={cn(
            "rounded-t-lg px-4 py-2 text-sm font-bold transition-colors",
            active === t.key
              ? "bg-orange-100 text-orange-900"
              : "text-stitch-on-surface-variant hover:bg-stitch-surface-container-low"
          )}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
