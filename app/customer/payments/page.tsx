import Link from "next/link";
import { MaterialIcon } from "@/components/home/material-icon";
import {
  appointmentStatusLabel,
  formatAppointmentDateShort,
  paymentMethodLabel,
  paymentVerificationLabel,
} from "@/lib/customer/format";
import { fetchAllCustomerAppointments } from "@/lib/customer/queries";
import { createClient } from "@/supabase/server";

export default async function CustomerPaymentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const rows = user ? await fetchAllCustomerAppointments(supabase, user.id, 40) : [];

  return (
    <div>
      <header className="mb-8">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stitch-secondary">
          Billing
        </span>
        <h1 className="font-headline text-3xl text-orange-900 md:text-4xl">Payment status</h1>
        <p className="mt-2 max-w-xl text-sm text-stitch-on-surface-variant">
          Per-appointment payment records from your bookings. Data is read from appointments and payments
          in Supabase.
        </p>
      </header>

      {rows.length === 0 ? (
        <p className="rounded-2xl bg-stitch-surface-container-low p-10 text-center text-sm text-stitch-on-surface-variant">
          No bookings yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex flex-col gap-4 rounded-2xl border border-stitch-outline-variant/15 bg-stitch-surface-container-lowest p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h2 className="font-headline text-lg text-orange-900">{row.serviceName}</h2>
                <p className="mt-1 text-sm text-stitch-on-surface-variant">
                  {formatAppointmentDateShort(row.startAt)} · {appointmentStatusLabel(row.status)}
                </p>
                <ul className="mt-3 space-y-1 text-sm text-stitch-on-surface-variant">
                  <li>Payment: {paymentVerificationLabel(row.paymentVerification)}</li>
                  {row.paymentMethod ? (
                    <li>Method: {paymentMethodLabel(row.paymentMethod)}</li>
                  ) : (
                    <li>Method: —</li>
                  )}
                  {row.paymentReference ? <li>Reference: {row.paymentReference}</li> : null}
                </ul>
              </div>
              <Link
                href={`/customer/appointments/${row.id}/manage`}
                className="inline-flex items-center gap-2 self-start rounded-full border border-stitch-outline-variant px-4 py-2 text-sm font-bold text-stitch-secondary hover:bg-stitch-surface-container-low sm:self-center"
              >
                Booking details
                <MaterialIcon name="chevron_right" className="text-lg" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
