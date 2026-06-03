"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { setAppointmentStatus, setPaymentVerification } from "@/app/actions/admin";

export function BookingApprovalActions(props: { appointmentId: string }) {
  const { appointmentId } = props;
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const r = await setAppointmentStatus(appointmentId, "booking_confirmed");
            if (r.error) toast.error(r.error);
            else toast.success("Booking approved");
          })
        }
        className="rounded-full bg-stitch-primary px-3 py-1 text-xs font-bold text-stitch-on-primary disabled:opacity-60"
      >
        Approve
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const r = await setAppointmentStatus(appointmentId, "rejected");
            if (r.error) toast.error(r.error);
            else toast.success("Booking rejected");
          })
        }
        className="rounded-full border border-red-300 px-3 py-1 text-xs font-bold text-red-700 disabled:opacity-60"
      >
        Reject
      </button>
    </div>
  );
}

export function PaymentApprovalActions(props: { paymentId: string }) {
  const { paymentId } = props;
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const r = await setPaymentVerification(paymentId, "verified");
            if (r.error) toast.error(r.error);
            else toast.success("Payment approved");
          })
        }
        className="rounded-full bg-stitch-primary px-3 py-1 text-xs font-bold text-stitch-on-primary disabled:opacity-60"
      >
        Approve
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const r = await setPaymentVerification(paymentId, "rejected");
            if (r.error) toast.error(r.error);
            else toast.success("Payment rejected");
          })
        }
        className="rounded-full border border-red-300 px-3 py-1 text-xs font-bold text-red-700 disabled:opacity-60"
      >
        Reject
      </button>
    </div>
  );
}

