import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/home/material-icon";
import {
  appointmentStatusLabel,
  formatAppointmentWhen,
  formatAppointmentDateShort,
  paymentVerificationLabel,
} from "@/lib/customer/format";
import type { NormalizedAppointment } from "@/lib/customer/queries";
import { cn } from "@/lib/utils";

export function CustomerAppointmentList(props: {
  items: NormalizedAppointment[];
  emptyMessage: string;
  variant: "upcoming" | "history";
}) {
  const { items, emptyMessage, variant } = props;

  if (items.length === 0) {
    return (
      <p className="rounded-2xl bg-stitch-surface-container-low p-10 text-center text-sm text-stitch-on-surface-variant">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {items.map((row) => (
        <li key={row.id}>
          <Link
            href={`/customer/appointments/${row.id}/manage`}
            className="group flex flex-col gap-4 rounded-2xl border border-stitch-outline-variant/15 bg-stitch-surface-container-lowest p-5 transition-all hover:border-stitch-primary/30 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stitch-surface-container-low">
                {row.serviceImageUrl ? (
                  <Image src={row.serviceImageUrl} alt="" fill className="object-cover" sizes="80px" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-stitch-outline">
                    <MaterialIcon name="spa" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-headline text-lg text-orange-900">{row.serviceName}</h3>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-stitch-on-surface-variant">
                  <MaterialIcon name="schedule" className="text-sm" />
                  {variant === "upcoming"
                    ? formatAppointmentWhen(row.startAt)
                    : formatAppointmentDateShort(row.startAt)}
                </p>
                {row.stylistName ? (
                  <p className="mt-1 text-xs text-stitch-on-surface-variant">{row.stylistName}</p>
                ) : null}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-end">
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest",
                  row.status === "booking_confirmed" && "bg-green-100 text-green-800",
                  row.status === "pending_payment" && "bg-amber-100 text-amber-900",
                  (row.status === "payment_submitted" || row.status === "payment_verified") &&
                    "bg-stitch-primary-fixed/40 text-stitch-on-primary-fixed-variant",
                  (row.status === "cancelled" || row.status === "rejected") && "bg-stone-200 text-stone-700",
                  ![
                    "booking_confirmed",
                    "pending_payment",
                    "payment_submitted",
                    "payment_verified",
                    "cancelled",
                    "rejected",
                  ].includes(row.status) && "bg-stone-100 text-stone-700"
                )}
              >
                {appointmentStatusLabel(row.status)}
              </span>
              {variant === "history" ? (
                <span className="rounded-full bg-stone-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-stone-600">
                  {paymentVerificationLabel(row.paymentVerification)}
                </span>
              ) : null}
              <span className="text-sm font-bold text-stitch-secondary group-hover:underline">Details</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
