export function formatAppointmentWhen(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-GH", {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export function formatAppointmentDateShort(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-GH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function appointmentStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pending_payment: "Pending payment",
    payment_submitted: "Payment sent",
    payment_verified: "Payment verified",
    booking_confirmed: "Confirmed",
    cancelled: "Cancelled",
    rejected: "Rejected",
  };
  return map[status] ?? status.replace(/_/g, " ");
}

export function paymentMethodLabel(method: string): string {
  const map: Record<string, string> = {
    mtn_momo: "MTN Mobile Money",
    vodafone_cash: "Vodafone Cash",
    airteltigo_money: "AirtelTigo Money",
  };
  return map[method] ?? method.replace(/_/g, " ");
}

export function paymentVerificationLabel(status: string | null): string {
  if (!status) return "Payment";
  switch (status) {
    case "verified":
      return "Paid";
    case "submitted":
      return "Pending review";
    case "rejected":
      return "Declined";
    default:
      return "Awaiting payment";
  }
}
