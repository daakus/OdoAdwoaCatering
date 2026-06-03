export type AdminSanctuaryNavItem = {
  href: string;
  label: string;
  icon: string;
  match?: (pathname: string) => boolean;
};

export const adminSanctuaryPrimaryNav: AdminSanctuaryNavItem[] = [
  {
    href: "/admin",
    label: "Overview",
    icon: "dashboard",
    match: (p) => p === "/admin",
  },
  {
    href: "/admin/calendar",
    label: "Appointments",
    icon: "calendar_today",
    match: (p) => p.startsWith("/admin/calendar"),
  },
  {
    href: "/admin/services",
    label: "Services",
    icon: "spa",
    match: (p) => p.startsWith("/admin/services"),
  },
  {
    href: "/admin/customers",
    label: "Clients",
    icon: "group",
    match: (p) => p.startsWith("/admin/customers"),
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: "settings",
    match: (p) => p.startsWith("/admin/settings"),
  },
];

export const adminSanctuarySecondaryNav: AdminSanctuaryNavItem[] = [
  { href: "/admin/bookings", label: "Bookings", icon: "event_note" },
  { href: "/admin/revenue", label: "Revenue", icon: "payments" },
  { href: "/admin/staff", label: "Staff", icon: "badge" },
  { href: "/admin/payments", label: "Payments", icon: "account_balance_wallet" },
  { href: "/admin/reports", label: "Reports", icon: "analytics" },
  { href: "/admin/approvals", label: "Approvals", icon: "verified" },
  { href: "/admin/notifications", label: "Alerts", icon: "notifications" },
];
