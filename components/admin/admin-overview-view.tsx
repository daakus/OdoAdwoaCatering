"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { MaterialIcon } from "@/components/home/material-icon";
import { cn } from "@/lib/utils";

export function AdminOverviewView() {
  const currentLabel = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date());
  }, []);

  return (
    <div className="overflow-x-hidden bg-stitch-background pb-24 text-stitch-on-surface md:pb-12">
      <main className="p-6 md:p-12">
        <header className="mb-10 flex flex-col justify-between gap-6 md:mb-12 md:flex-row md:items-end">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2rem] text-stitch-primary">
              Management Dashboard
            </span>
            <h2 className="font-display text-4xl font-medium tracking-tight text-stitch-on-background md:text-5xl">
              Admin <span className="italic">Overview</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden text-right md:block">
              <p className="text-xs font-bold uppercase tracking-widest text-stitch-secondary">Current Date</p>
              <p className="font-display text-lg text-stitch-on-surface">{currentLabel}</p>
            </div>
            <div className="mx-4 hidden h-12 w-px bg-stitch-outline-variant opacity-20 md:block" />
            <button
              type="button"
              className="rounded-full bg-stitch-surface-container-lowest p-3 text-stitch-primary shadow-sm dark:bg-stone-900"
              aria-label="Notifications"
            >
              <MaterialIcon name="notifications" size="sm" />
            </button>
          </div>
        </header>

        <div className="mb-10 grid grid-cols-1 gap-6 md:mb-12 md:grid-cols-3">
          <div className="group rounded-xl bg-stitch-surface-container-lowest p-8 shadow-sm transition-colors duration-500 hover:bg-stitch-primary dark:bg-white/95">
            <div className="mb-6 flex items-start justify-between">
              <MaterialIcon
                name="event_available"
                className="text-3xl text-stitch-primary group-hover:text-stitch-on-primary"
                size="lg"
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-stitch-secondary group-hover:text-stitch-primary-fixed">
                Total Bookings
              </span>
            </div>
            <p className="mb-1 font-display text-4xl group-hover:text-stitch-on-primary">1,284</p>
            <p className="text-xs text-orange-800/60 group-hover:text-stitch-primary-fixed">+12% from last month</p>
          </div>
          <div className="group rounded-xl bg-stitch-surface-container-lowest p-8 shadow-sm transition-colors duration-500 hover:bg-stitch-secondary dark:bg-white/95">
            <div className="mb-6 flex items-start justify-between">
              <MaterialIcon
                name="payments"
                className="text-3xl text-stitch-secondary group-hover:text-stitch-on-secondary"
                size="lg"
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-stitch-secondary group-hover:text-stitch-secondary-fixed">
                Daily Revenue
              </span>
            </div>
            <p className="mb-1 font-display text-4xl group-hover:text-stitch-on-secondary">GHS 4,920</p>
            <p className="text-xs text-orange-800/60 group-hover:text-stitch-secondary-fixed">84% of daily goal</p>
          </div>
          <div className="group rounded-xl bg-stitch-surface-container-lowest p-8 shadow-sm transition-colors duration-500 hover:bg-stitch-tertiary dark:bg-white/95">
            <div className="mb-6 flex items-start justify-between">
              <MaterialIcon
                name="badge"
                className="text-3xl text-stitch-tertiary group-hover:text-white"
                size="lg"
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-stitch-tertiary group-hover:text-stitch-tertiary-fixed">
                Active Staff
              </span>
            </div>
            <p className="mb-1 font-display text-4xl group-hover:text-white">18</p>
            <p className="text-xs text-orange-800/60 group-hover:text-stitch-tertiary-fixed">4 on break</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl bg-stitch-surface-container-low p-8">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="font-display text-2xl italic text-stitch-on-surface">Order Schedule</h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-full p-2 transition-colors hover:bg-stitch-surface-container"
                    aria-label="Previous"
                  >
                    <MaterialIcon name="chevron_left" size="sm" />
                  </button>
                  <button
                    type="button"
                    className="rounded-full p-2 transition-colors hover:bg-stitch-surface-container"
                    aria-label="Next"
                  >
                    <MaterialIcon name="chevron_right" size="sm" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <div
                    key={d}
                    className="py-2 text-[10px] font-bold uppercase tracking-[0.15rem] text-orange-800/40"
                  >
                    {d}
                  </div>
                ))}
                {[21, 22, 23].map((n) => (
                  <div
                    key={n}
                    className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl text-sm text-orange-800/40 transition-colors hover:bg-stitch-surface-container"
                  >
                    {n}
                  </div>
                ))}
                <div className="flex aspect-square scale-105 cursor-pointer flex-col items-center justify-center rounded-xl bg-stitch-primary text-stitch-on-primary shadow-lg">
                  <span className="text-sm font-bold">24</span>
                  <span className="mt-1 h-1 w-1 rounded-full bg-stitch-on-primary" />
                </div>
                {[25, 26, 27].map((n) => (
                  <div
                    key={n}
                    className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl text-sm text-stitch-on-surface transition-colors hover:bg-stitch-surface-container"
                  >
                    {n}
                  </div>
                ))}
              </div>
              <div className="mt-10 space-y-4">
                <div className="flex items-center gap-4 rounded-xl p-4 transition-colors hover:bg-stitch-surface-container-highest md:gap-6">
                  <div className="min-w-[60px] text-right">
                    <p className="text-xs font-bold text-orange-900 dark:text-orange-200">09:00</p>
                    <p className="text-[10px] uppercase tracking-tighter text-orange-800/60">AM</p>
                  </div>
                  <div className="h-12 w-1 rounded-full bg-stitch-primary-container" />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg text-stitch-on-surface">Kenkey Package – 10 pax</p>
                    <p className="text-xs text-orange-800/60">Client: Imani K. | Ref: ODA-001</p>
                  </div>
                  <div className="rounded-full bg-stitch-primary-fixed px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-stitch-primary">
                    Confirmed
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-xl p-4 transition-colors hover:bg-stitch-surface-container-highest md:gap-6">
                  <div className="min-w-[60px] text-right">
                    <p className="text-xs font-bold text-orange-900 dark:text-orange-200">10:30</p>
                    <p className="text-[10px] uppercase tracking-tighter text-orange-800/60">AM</p>
                  </div>
                  <div className="h-12 w-1 rounded-full bg-stitch-secondary" />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg text-stitch-on-surface">Event Catering – Wedding (50 pax)</p>
                    <p className="text-xs text-orange-800/60">Client: Naomi W. | Ref: ODA-002</p>
                  </div>
                  <div className="rounded-full bg-stitch-secondary-fixed px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-stitch-secondary">
                    In-Progress
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl bg-stitch-surface-container-lowest p-8 shadow-sm dark:bg-white/95">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="font-display text-xl italic text-stitch-on-surface">Pending Requests</h3>
                <span className="rounded bg-red-100 px-2 py-1 text-[10px] font-bold text-red-900 dark:bg-red-950 dark:text-red-200">
                  4 NEW
                </span>
              </div>
              <div className="space-y-8">
                <div>
                  <div className="mb-4 flex gap-4">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-stitch-surface-container">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzC4_oyJZ1Ig3VEYWfLVw2t6PPJFeokkv0JdAjK6m_cL-ZtnnlyO-AuaUD4aouRP_5uMZr3UKPLK3qnmigXUkxCf6uo7h3sqc4sFfl1zqQFrpz_gjJux2Zkoh-z_0L_UrnVXqGobf7DmBmgqJOhUE9rjsI1FJMmppRO6FScq5fJrjWwVzLbJH4Z_prSFSJbrhS2fJKwjaRETLfGemoOI5cpJKEJA0m02gzeJQ7GHVO2D4tHpx6aO31VjuXbUsFDYk8uTy0IRzqmdvj"
                        alt=""
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-stitch-on-surface">Amara Okafor</p>
                      <p className="text-xs text-orange-800/60">Gel-X Sculpt &amp; Art</p>
                      <p className="mt-1 text-[10px] font-bold text-stitch-primary">Tomorrow @ 2:00 PM</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="flex-1 rounded-lg bg-stitch-primary-container py-2 text-[10px] font-bold uppercase tracking-widest text-stitch-on-primary-container transition-opacity hover:opacity-90"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-stitch-surface-container-high px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-stitch-on-surface-variant transition-all hover:bg-destructive hover:text-white"
                    >
                      Reject
                    </button>
                  </div>
                </div>
                <div>
                  <div className="mb-4 flex gap-4">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-stitch-surface-container">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzioTMr5Aed9qw95s0KJBg1GiwR1vTGBeR1NAOpZ_NQ273bSSACA7E_liBU2NUKLX4tH71VwTUk-rsfBq04cP6ZxFe_oV1oz6Kwf8IGCP0I5kyhny1o9WIxpXxQBvCoTxt7mjtjniNjNdjB_IzBX6LQC6oq6S1vRnBUfWWw_6mvFPDvVr0iLEJxzxRNSakW_UyiHjJbiM-TjmdljpY4Z0TiMyfnMePi9dFwmOFX3RKlFfVVnqbqpjIVKzywqCOV1GHXvBP43kpNMMj"
                        alt=""
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-stitch-on-surface">David M.</p>
                      <p className="text-xs text-orange-800/60">Gentleman&apos;s Grooming</p>
                      <p className="mt-1 text-[10px] font-bold text-stitch-primary">Sat @ 10:00 AM</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="flex-1 rounded-lg bg-stitch-primary-container py-2 text-[10px] font-bold uppercase tracking-widest text-stitch-on-primary-container transition-opacity hover:opacity-90"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-stitch-surface-container-high px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-stitch-on-surface-variant transition-all hover:bg-destructive hover:text-white"
                    >
                      Reject
                    </button>
                  </div>
                </div>
                <Link
                  href="/admin/approvals"
                  className="block w-full border-t border-stitch-outline-variant/20 py-4 text-center text-xs font-bold text-orange-800/40 transition-colors hover:text-stitch-primary"
                >
                  View All Requests
                </Link>
              </div>
            </div>

            <div className="rounded-xl bg-stitch-surface-container-low p-8">
              <h3 className="mb-6 font-display text-xl italic text-stitch-on-surface">Staff on Duty</h3>
              <div className="space-y-4">
                {[
                  { name: "Ama (Kitchen)", status: "Busy", dot: "green" as const },
                  { name: "Kofi (Delivery)", status: "Busy", dot: "green" as const },
                  { name: "Akua (Prep)", status: "On Break", dot: "orange" as const },
                ].map((row) => (
                  <div key={row.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full",
                          row.dot === "green"
                            ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                            : "bg-orange-400"
                        )}
                      />
                      <span className="text-sm font-medium text-stitch-on-surface">{row.name}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-orange-800/40">{row.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 z-30 flex w-full items-center justify-around rounded-t-3xl bg-stitch-surface/80 px-4 pb-6 pt-3 shadow-nav-up backdrop-blur-xl md:hidden">
        <Link
          href="/admin"
          className="flex scale-90 flex-col items-center justify-center rounded-2xl bg-orange-100 px-4 py-1 text-orange-900 transition-transform duration-300"
        >
          <MaterialIcon name="home" size="sm" />
          <span className="mt-1 text-[10px] uppercase tracking-[0.1rem]">Home</span>
        </Link>
        <Link
          href="/admin/services"
          className="flex scale-90 flex-col items-center justify-center text-orange-800/50 transition-transform duration-300 hover:bg-orange-50"
        >
          <MaterialIcon name="restaurant_menu" size="sm" />
          <span className="mt-1 text-[10px] uppercase tracking-[0.1rem]">Menu</span>
        </Link>
        <Link
          href="/admin/calendar"
          className="flex scale-90 flex-col items-center justify-center text-orange-800/50 transition-transform duration-300 hover:bg-orange-50"
        >
          <MaterialIcon name="event_note" size="sm" />
          <span className="mt-1 text-[10px] uppercase tracking-[0.1rem]">Bookings</span>
        </Link>
        <Link
          href="/admin/customers"
          className="flex scale-90 flex-col items-center justify-center text-orange-800/50 transition-transform duration-300 hover:bg-orange-50"
        >
          <MaterialIcon name="person" size="sm" />
          <span className="mt-1 text-[10px] uppercase tracking-[0.1rem]">Profile</span>
        </Link>
      </nav>

      <footer className="mt-12 grid w-full max-w-7xl grid-cols-1 gap-12 bg-stitch-surface-container-low px-8 py-16 transition-all duration-300 ease-out md:mx-auto md:grid-cols-4">
        <div className="md:col-span-1">
          <span className="mb-4 block font-display text-2xl italic text-orange-900 dark:text-orange-200">
            Odo Adwoa Catering
          </span>
          <p className="text-sm leading-relaxed opacity-70">Admin Dashboard &amp; Management Portal.</p>
        </div>
        <div className="space-y-4 md:col-span-1">
          <p className="text-xs font-bold uppercase tracking-widest text-stitch-primary">Administration</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/admin/staff" className="opacity-70 hover:text-orange-700 hover:opacity-100 dark:hover:text-orange-300">
                Staff Portal
              </Link>
            </li>
            <li>
              <Link href="/admin/reports" className="opacity-70 hover:text-orange-700 hover:opacity-100 dark:hover:text-orange-300">
                Financial Reports
              </Link>
            </li>
            <li>
              <Link href="/admin/revenue" className="opacity-70 hover:text-orange-700 hover:opacity-100 dark:hover:text-orange-300">
                Revenue
              </Link>
            </li>
          </ul>
        </div>
        <div className="self-end text-right md:col-span-2">
          <p className="text-sm leading-relaxed opacity-70">
            © {new Date().getFullYear()} Odo Adwoa Catering Services. Traditional Taste, Quality & Satisfaction.
          </p>
        </div>
      </footer>
    </div>
  );
}
