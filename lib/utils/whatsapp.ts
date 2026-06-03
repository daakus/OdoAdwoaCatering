import { VENDOR_WHATSAPP } from "@/lib/constants/site";
import type { CartLine } from "@/stores/cart-store";

export interface OrderWhatsAppPayload {
  customerName: string;
  customerPhone: string;
  paymentMethod: string;
  paymentReference: string;
  receiptUrl: string;
  lines: CartLine[];
  total: number;
}

export interface EventWhatsAppPayload {
  eventType: string;
  customerName: string;
  customerPhone: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  guestCount: number;
  selectedPackages: string[];
  depositPaid: number;
  receiptUrl: string;
}

function methodLabel(method: string) {
  if (method === "mtn_momo")         return "MTN MoMo";
  if (method === "vodafone_cash")    return "Vodafone Cash";
  if (method === "airteltigo_money") return "AirtelTigo Money";
  return method;
}

export function buildOrderWhatsAppUrl(payload: OrderWhatsAppPayload): string {
  const itemLines = payload.lines
    .map(
      (l) =>
        `  • ${l.quantity}x ${l.item.title} @ GH₵${l.item.priceGhs.toFixed(2)} = GH₵${(l.item.priceGhs * l.quantity).toFixed(2)}`
    )
    .join("\n");

  const text = `🛒 *NEW FOOD ORDER — Odo Adwoa Catering*
-----------------------------------------
*Customer Name:* ${payload.customerName}
*Phone Number:* ${payload.customerPhone}

*Order Items:*
${itemLines}

*Total:* GH₵ ${payload.total.toFixed(2)}
*Payment Method:* ${methodLabel(payload.paymentMethod)}
*Reference:* ${payload.paymentReference}
-----------------------------------------
*Proof of Payment:* ${payload.receiptUrl}

_Deliciously Made. Freshly Served. Always the Best!_`;

  return `${VENDOR_WHATSAPP}?text=${encodeURIComponent(text)}`;
}

export function buildEventWhatsAppUrl(payload: EventWhatsAppPayload): string {
  const packageLines = payload.selectedPackages
    .map((p) => `  - ${p}`)
    .join("\n");

  const text = `🚨 *NEW EVENT CATERING BOOKING 🚨*
-----------------------------------------
*Event Type:* ${payload.eventType}
*Customer Name:* ${payload.customerName}
*Phone Number:* ${payload.customerPhone}
*Event Date & Time:* ${payload.eventDate} / ${payload.eventTime}
*Location/Venue:* ${payload.venue}
*Estimated Guest Count:* ${payload.guestCount} guests

*Selected Menu Items/Packages:*
${packageLines}

*Total/Deposit Paid:* GH₵ ${payload.depositPaid.toFixed(2)}
-----------------------------------------
*Proof of Payment Receipt:* ${payload.receiptUrl}

_Deliciously Made. Freshly Served. Always the Best!_`;

  return `${VENDOR_WHATSAPP}?text=${encodeURIComponent(text)}`;
}
