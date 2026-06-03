import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/home/material-icon";
import {
  appointmentStatusLabel,
  formatAppointmentWhen,
  paymentMethodLabel,
  paymentVerificationLabel,
} from "@/lib/customer/format";
import type { CustomerAppointmentRow } from "@/lib/customer/queries";
import { normalizeCustomerAppointment } from "@/lib/customer/queries";

function paymentRow(
  p: CustomerAppointmentRow["payments"]
): { verification_status: string; method: string; reference: string | null } | null {
  if (!p) return null;
  if (Array.isArray(p)) return p[0] ?? null;
  return p;
}

export function CustomerAppointmentManage(props: { row: CustomerAppointmentRow }) {
  const { row } = props;
  const summary = normalizeCustomerAppointment(row);
  const pay = paymentRow(row.payments);

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/customer/appointments/upcoming"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-stitch-secondary hover:underline"
      >
        <MaterialIcon name="arrow_back" className="text-sm" />
        Back to appointments
      </Link>

      <div className="overflow-hidden rounded-2xl border border-stitch-outline-variant/20 bg-stitch-surface-container-lowest shadow-sm">
        <div className="relative h-48 w-full bg-stitch-surface-container-low md:h-56">
          {summary.serviceImageUrl ? (
            <Image
              src={summary.serviceImageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-stitch-outline">
              <MaterialIcon name="spa" className="text-5xl" />
            </div>
          )}
        </div>
        <div className="p-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stitch-secondary">
            {appointmentStatusLabel(row.status)}
          </span>
          <h1 className="mt-2 font-headline text-3xl text-orange-900">{summary.serviceName}</h1>
          <p className="mt-3 flex flex-wrap items-center gap-2 text-stitch-on-surface-variant">
            <MaterialIcon name="schedule" />
            {formatAppointmentWhen(row.start_at)}
          </p>
          {summary.stylistName ? (
            <p className="mt-2 text-sm text-stitch-on-surface-variant">
              Stylist: {summary.stylistName}
            </p>
          ) : null}

          <div className="mt-8 border-t border-stitch-outline-variant/20 pt-8">
            <h2 className="font-headline text-lg text-orange-900">Payment</h2>
            {pay ? (
              <ul className="mt-3 space-y-2 text-sm text-stitch-on-surface-variant">
                <li>Status: {paymentVerificationLabel(pay.verification_status)}</li>
                <li>Method: {paymentMethodLabel(pay.method)}</li>
                {pay.reference ? <li>Reference: {pay.reference}</li> : null}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-stitch-on-surface-variant">
                No payment record yet. Complete MoMo instructions from your booking email or the payment
                page.
              </p>
            )}
            <Link
              href="/customer/payments"
              className="mt-4 inline-block text-sm font-bold text-stitch-primary hover:underline"
            >
              Payment status overview
            </Link>
          </div>

          <div className="mt-10 rounded-xl bg-stitch-surface-container-low p-6">
            <h2 className="font-headline text-lg text-orange-900">Changes & cancellations</h2>
            <p className="mt-2 text-sm text-stitch-on-surface-variant">
              Need to reschedule or cancel? Our team can update your appointment. In a future release you
              will be able to request changes directly from this screen.
            </p>
            <p className="mt-4 text-sm font-medium text-orange-900">
              Contact us with your booking reference:{" "}
              <span className="font-mono text-sm">{row.id.slice(0, 8)}…</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
