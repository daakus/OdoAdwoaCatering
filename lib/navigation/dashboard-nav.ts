import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  Calendar,
  CalendarDays,
  ClipboardList,
  CreditCard,
  Heart,
  Home,
  LayoutDashboard,
  MessageSquare,
  Scissors,
  Settings,
  Users,
  Wallet,
} from "lucide-react";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const customerNav: DashboardNavItem[] = [
  { href: "/customer", label: "Overview", icon: LayoutDashboard },
  { href: "/customer/appointments/upcoming", label: "Upcoming", icon: Calendar },
  { href: "/customer/appointments/history", label: "History", icon: CalendarDays },
  { href: "/customer/favorites", label: "Favorites", icon: Heart },
  { href: "/customer/notifications", label: "Notifications", icon: Bell },
  { href: "/customer/settings", label: "Profile", icon: Settings },
  { href: "/customer/payments", label: "Payment status", icon: CreditCard },
];

export const adminNav: DashboardNavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/revenue", label: "Revenue", icon: Wallet },
  { href: "/admin/bookings", label: "Bookings", icon: ClipboardList },
  { href: "/admin/calendar", label: "Calendar", icon: Calendar },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/staff", label: "Staff", icon: Users },
  { href: "/admin/services", label: "Services", icon: Scissors },
  { href: "/admin/payments", label: "Payment verification", icon: CreditCard },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/approvals", label: "Approvals", icon: ClipboardList },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
];

export const staffNav: DashboardNavItem[] = [
  { href: "/staff", label: "Overview", icon: Home },
  { href: "/staff/appointments", label: "Assigned", icon: Calendar },
  { href: "/staff/schedule", label: "Daily schedule", icon: CalendarDays },
  { href: "/staff/notes", label: "Customer notes", icon: MessageSquare },
  { href: "/staff/availability", label: "Availability", icon: Settings },
];
