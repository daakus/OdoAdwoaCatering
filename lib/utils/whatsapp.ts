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

// ── Customer approval notifications (sent TO customer's number) ───────────────

export function buildOrderConfirmationUrl(payload: {
  customerName: string;
  customerPhone: string;
  totalGhs: number;
}): string {
  const text =
    `Hello ${payload.customerName}! 🎉\n\n` +
    `Your order from *Odo Adwoa Catering* has been *confirmed*.\n\n` +
    `We are preparing your food now. We will call you on *${payload.customerPhone}* to arrange delivery or pickup.\n\n` +
    `*Order total:* GH₵ ${payload.totalGhs.toFixed(2)}\n\n` +
    `Thank you for choosing Odo Adwoa! 🌽\n` +
    `_Deliciously Made. Freshly Served. Always the Best!_`;

  const intlPhone = payload.customerPhone.replace(/^0/, "233");
  return `https://wa.me/${intlPhone}?text=${encodeURIComponent(text)}`;
}

export function buildEventConfirmationUrl(payload: {
  customerName: string;
  customerPhone: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  depositGhs: number;
}): string {
  const text =
    `Hello ${payload.customerName}! 🎊\n\n` +
    `Your *${payload.eventType}* catering booking with *Odo Adwoa Catering* has been *confirmed*.\n\n` +
    `📅 *Event Date:* ${payload.eventDate}\n` +
    `👥 *Guests:* ${payload.guestCount}\n` +
    `💰 *Deposit received:* GH₵ ${payload.depositGhs.toFixed(2)}\n\n` +
    `We will contact you on *${payload.customerPhone}* to finalise all details.\n\n` +
    `Thank you for choosing Odo Adwoa Catering! 🌽\n` +
    `_Deliciously Made. Freshly Served. Always the Best!_`;

  const intlPhone = payload.customerPhone.replace(/^0/, "233");
  return `https://wa.me/${intlPhone}?text=${encodeURIComponent(text)}`;
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
