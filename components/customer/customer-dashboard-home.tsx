import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/home/material-icon";
import { formatAppointmentWhen, formatAppointmentDateShort, paymentVerificationLabel } from "@/lib/customer/format";
import type { NormalizedAppointment } from "@/lib/customer/queries";
import { cn } from "@/lib/utils";

export interface CustomerDashboardHomeProps {
  firstName: string;
  upcoming: NormalizedAppointment | null;
  recentPast: NormalizedAppointment[];
}

export function CustomerDashboardHome({ firstName, upcoming, recentPast }: CustomerDashboardHomeProps) {
  const subtitle = upcoming
    ? `Your next visit is ${formatAppointmentWhen(upcoming.startAt)}.`
    : "No upcoming appointment yet—book a service when you’re ready.";

  return (
    <>
      <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2rem] text-stitch-secondary">
            Your Sanctuary Dashboard
          </span>
          <h1 className="font-headline text-4xl italic tracking-tight text-orange-900 md:text-5xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-2 max-w-md text-stitch-on-surface-variant">{subtitle}</p>
        </div>
        <Link
          href="/booking"
          className="w-fit rounded-full bg-stitch-primary px-8 py-4 font-bold text-stitch-on-primary shadow-lg shadow-stitch-primary/10 transition-all hover:opacity-90 active:scale-95"
        >
          Book New Service
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <section className="lg:col-span-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-stitch-outline-variant/10 bg-stitch-surface-container-lowest p-8 shadow-editorial md:p-12">
            <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-stitch-primary-fixed/30 blur-3xl" />
            <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row">
              {upcoming ? (
                <>
                  <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-stitch-surface-container-low shadow-xl md:w-48 md:shrink-0">
                    {upcoming.serviceImageUrl ? (
                      <Image
                        src={upcoming.serviceImageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 192px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-stitch-outline">
                        <MaterialIcon name="spa" className="text-4xl" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <span className="mb-4 inline-block rounded-full bg-stitch-secondary-container/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-stitch-on-secondary-container">
                      Upcoming appointment
                    </span>
                    <h2 className="mb-1 font-headline text-2xl text-orange-900">{upcoming.serviceName}</h2>
                    <p className="mb-2 flex flex-wrap items-center justify-center gap-2 text-stitch-on-surface-variant md:justify-start">
                      <MaterialIcon name="schedule" className="text-sm" />
                      {formatAppointmentWhen(upcoming.startAt)}
                    </p>
                    {upcoming.stylistName ? (
                      <p className="mb-6 text-sm text-stitch-on-surface-variant">
                        With {upcoming.stylistName}
                      </p>
                    ) : (
                      <p className="mb-6 text-sm text-stitch-on-surface-variant">Stylist TBD</p>
                    )}
                    <div className="flex flex-wrap justify-center gap-4 md:justify-start">
                      <Link
                        href={`/customer/appointments/${upcoming.id}/manage`}
                        className="rounded-full border-2 border-stitch-outline-variant px-6 py-2 text-sm font-bold text-orange-900 transition-colors hover:bg-orange-50"
                      >
                        Manage booking
                      </Link>
                      <Link
                        href="/customer/appointments/upcoming"
                        className="rounded-full px-6 py-2 text-sm font-bold text-stitch-primary hover:underline"
                      >
                        All upcoming
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex w-full flex-col items-center gap-4 py-6 text-center md:items-start md:text-left">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stitch-surface-container-low text-stitch-primary">
                    <MaterialIcon name="event_available" className="text-3xl" />
                  </div>
                  <div>
                    <h2 className="font-headline text-2xl text-orange-900">Nothing on the calendar</h2>
                    <p className="mt-2 max-w-md text-stitch-on-surface-variant">
                      Book a treatment to see it here with date, stylist, and payment status.
                    </p>
                  </div>
                  <Link
                    href="/booking"
                    className="rounded-full bg-stitch-primary px-6 py-3 text-sm font-bold text-stitch-on-primary"
                  >
                    Book now
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h3 className="font-headline text-2xl text-orange-900">Recent visits</h3>
              <Link
                href="/customer/appointments/history"
                className="text-sm font-bold text-stitch-secondary hover:underline"
              >
                View all
              </Link>
            </div>
            {recentPast.length === 0 ? (
              <p className="rounded-2xl bg-stitch-surface-container-low p-8 text-center text-sm text-stitch-on-surface-variant">
                Past appointments will appear here after your first completed visit.
              </p>
            ) : (
              <div className="space-y-4">
                {recentPast.map((row) => (
                  <Link
                    key={row.id}
                    href="/customer/appointments/history"
                    className="group flex items-center justify-between rounded-2xl bg-stitch-surface-container-low p-6 transition-colors hover:bg-stitch-surface-container-lowest"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-orange-900">
                        <MaterialIcon name="spa" />
                      </div>
                      <div>
                        <h4 className="font-bold text-orange-900">{row.serviceName}</h4>
                        <p className="text-xs text-stitch-on-surface-variant">
                          {formatAppointmentDateShort(row.startAt)}
                          {row.stylistName ? ` • ${row.stylistName}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest",
                          row.paymentVerification === "verified"
                            ? "bg-green-100 text-green-800"
                            : "bg-stone-100 text-stone-600"
                        )}
                      >
                        {paymentVerificationLabel(row.paymentVerification)}
                      </span>
                      <MaterialIcon
                        name="chevron_right"
                        className="text-orange-300 opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="space-y-8 lg:col-span-4">
          <div className="relative overflow-hidden rounded-[2rem] bg-stitch-surface-container p-8 text-stitch-on-surface">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stitch-on-surface-variant">
              Account
            </span>
            <p className="my-3 font-headline text-xl text-orange-900">Sanctuary member</p>
            <p className="text-sm text-stitch-on-surface-variant">
              Manage your profile, favorites, and notification preferences from the sidebar.
            </p>
            <Link
              href="/customer/settings"
              className="mt-4 inline-flex items-center gap-2 border-b border-stitch-primary/30 pb-1 text-sm font-bold text-stitch-primary"
            >
              Profile settings <MaterialIcon name="arrow_forward" className="text-sm" />
            </Link>
          </div>

          <div className="rounded-[2rem] bg-stitch-surface-container p-8">
            <h3 className="mb-2 font-headline text-xl text-orange-900">Payments</h3>
            <p className="mb-4 text-sm text-stitch-on-surface-variant">
              Ghana bookings use Mobile Money. Track verification status for each appointment.
            </p>
            <Link
              href="/customer/payments"
              className="text-sm font-bold text-stitch-secondary hover:underline"
            >
              View payment status
            </Link>
          </div>

          <div className="rounded-[2rem] border border-stitch-outline-variant/20 bg-gradient-to-br from-stitch-primary-fixed/40 to-stitch-surface-container-lowest p-8">
            <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-stitch-on-surface-variant">
              Favorites
            </span>
            <h4 className="font-headline text-xl italic text-orange-900">Save services for quick rebooking</h4>
            <p className="mt-2 text-sm text-stitch-on-surface-variant">
              Heart services from the catalog to see them here.
            </p>
            <Link href="/customer/favorites" className="mt-4 inline-block text-sm font-bold text-stitch-primary">
              Open favorites
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
