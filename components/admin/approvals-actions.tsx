"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { setAppointmentStatus, setPaymentVerification, setOrderStatus, setEventStatus } from "@/app/actions/admin";
import { buildOrderConfirmationUrl, buildEventConfirmationUrl } from "@/lib/utils/whatsapp";

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

export function OrderApprovalActions(props: {
  orderId: string;
  customerName: string;
  customerPhone: string;
  totalGhs: number;
}) {
  const { orderId, customerName, customerPhone, totalGhs } = props;
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const r = await setOrderStatus(orderId, "confirmed");
            if (r.error) {
              toast.error(r.error);
              return;
            }
            // Open WhatsApp to customer with confirmation message
            const waUrl = buildOrderConfirmationUrl({ customerName, customerPhone, totalGhs });
            window.open(waUrl, "_blank");
            toast.success("Order confirmed — WhatsApp opened to notify customer");
          })
        }
        className="rounded-full bg-stitch-primary px-4 py-1.5 text-xs font-bold text-stitch-on-primary disabled:opacity-60"
      >
        {pending ? "…" : "✓ Approve"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const r = await setOrderStatus(orderId, "cancelled");
            if (r.error) toast.error(r.error);
            else toast.success("Order cancelled");
          })
        }
        className="rounded-full border border-red-300 px-4 py-1.5 text-xs font-bold text-red-700 disabled:opacity-60"
      >
        Reject
      </button>
    </div>
  );
}

export function EventApprovalActions(props: {
  eventId: string;
  customerName: string;
  customerPhone: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  depositGhs: number;
}) {
  const { eventId, customerName, customerPhone, eventType, eventDate, guestCount, depositGhs } = props;
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const r = await setEventStatus(eventId, "confirmed");
            if (r.error) {
              toast.error(r.error);
              return;
            }
            // Open WhatsApp to customer with confirmation message
            const waUrl = buildEventConfirmationUrl({ customerName, customerPhone, eventType, eventDate, guestCount, depositGhs });
            window.open(waUrl, "_blank");
            toast.success("Event confirmed — WhatsApp opened to notify customer");
          })
        }
        className="rounded-full bg-stitch-primary px-4 py-1.5 text-xs font-bold text-stitch-on-primary disabled:opacity-60"
      >
        {pending ? "…" : "✓ Confirm"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const r = await setEventStatus(eventId, "cancelled");
            if (r.error) toast.error(r.error);
            else toast.success("Event booking cancelled");
          })
        }
        className="rounded-full border border-red-300 px-4 py-1.5 text-xs font-bold text-red-700 disabled:opacity-60"
      >
        Reject
      </button>
    </div>
  );
}
