"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart-store";
import { submitOrder } from "@/app/actions/order";
import { buildOrderWhatsAppUrl } from "@/lib/utils/whatsapp";
import { cn } from "@/lib/utils";
import { MaterialIcon } from "@/components/home/material-icon";

type Step = 1 | 2 | 3;

const PAYMENT_METHODS = [
  { value: "mtn_momo",         label: "MTN MoMo",        number: process.env.NEXT_PUBLIC_MOMO_MTN_NUMBER ?? "0545761374" },
  { value: "vodafone_cash",    label: "Vodafone Cash",    number: process.env.NEXT_PUBLIC_MOMO_VODAFONE_NUMBER ?? "—" },
  { value: "airteltigo_money", label: "AirtelTigo Money", number: process.env.NEXT_PUBLIC_MOMO_AIRTELTIGO_NUMBER ?? "—" },
] as const;

export function OrderCheckoutView() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const { lines, subtotal, itemCount, updateQuantity, removeItem, clearCart } = useCartStore();

  const [step, setStep]           = useState<Step>(1);
  const [name, setName]           = useState("");
  const [phone, setPhone]         = useState("");
  const [email, setEmail]         = useState("");
  const [notes, setNotes]         = useState("");
  const [method, setMethod]       = useState<"mtn_momo" | "vodafone_cash" | "airteltigo_money">("mtn_momo");
  const [reference, setRef]       = useState("");
  const [screenshot, setShot]     = useState<File | null>(null);
  const [submitting, setSub]      = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [mounted, setMounted]     = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const total = subtotal();
  const count = itemCount();

  // Avoid hydration mismatch — Zustand localStorage state only available client-side
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stitch-surface pt-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-stitch-primary border-t-transparent" />
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-stitch-surface px-4 pt-24 text-center">
        <span className="text-6xl">🛒</span>
        <h2 className="font-display text-2xl text-orange-900">Your cart is empty</h2>
        <p className="text-sm text-stitch-on-surface-variant">Add some items from the menu first.</p>
        <Link href="/menu" className="rounded-full bg-stitch-primary px-8 py-3 text-sm font-bold text-stitch-on-primary">
          Browse Menu
        </Link>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!name.trim())      return toast.error("Enter your name.");
    if (!phone.trim())     return toast.error("Enter your phone number.");
    if (!reference.trim()) return toast.error("Enter your payment reference.");
    if (!screenshot)       return toast.error("Upload your payment screenshot.");

    setSub(true);
    const fd = new FormData();
    fd.set("customer_name",     name.trim());
    fd.set("customer_phone",    phone.trim());
    fd.set("customer_email",    email.trim());
    fd.set("notes",             notes.trim());
    fd.set("payment_method",    method);
    fd.set("payment_reference", reference.trim());
    fd.set("payment_screenshot", screenshot);
    fd.set("lines", JSON.stringify(
      lines.map((l) => ({
        itemId:       l.item.id,
        itemName:     l.item.title,
        itemPriceGhs: l.item.priceGhs,
        quantity:     l.quantity,
      }))
    ));

    const res = await submitOrder(fd);
    setSub(false);

    if ("error" in res && res.error) { toast.error(res.error); return; }

    if ("success" in res && res.success) {
      const waUrl = buildOrderWhatsAppUrl({
        customerName:     name.trim(),
        customerPhone:    phone.trim(),
        paymentMethod:    method,
        paymentReference: reference.trim(),
        receiptUrl:       res.receiptUrl ?? "",
        lines,
        total,
      });
      clearCart();
      if (res.newAccountCreated) setEmailSent(true);
      toast.success("Order placed!");
      // Pass WhatsApp URL to confirmation page — opening it there avoids popup blockers
      router.push(
        `/order/confirmation/${res.orderId}?wa=${encodeURIComponent(waUrl)}`
      );
    }
  };

  const stepLabel: Record<Step, string> = { 1: "Review Cart", 2: "Your Details", 3: "Payment" };

  return (
    <div className="min-h-screen bg-stitch-surface pb-28 pt-24 text-stitch-on-surface">
      <div className="mx-auto max-w-2xl px-4 md:px-8">
        <header className="mb-8 text-center">
          <p className="font-label text-[10px] uppercase tracking-[0.3em] text-stitch-secondary">Checkout</p>
          <h1 className="mt-2 font-display text-3xl text-orange-900">{stepLabel[step]}</h1>
        </header>

        {/* ── Email confirmation banner ── */}
        {emailSent && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-300 bg-green-50 p-4 text-sm text-green-900">
            <MaterialIcon name="mark_email_unread" className="mt-0.5 shrink-0 text-green-600" />
            <div>
              <p className="font-bold">Account created — check your email!</p>
              <p className="mt-1 text-green-800/80">
                We sent a confirmation link to <span className="font-semibold">{email}</span>.
                Click it to activate your account and track your orders.
              </p>
            </div>
          </div>
        )}

        {/* Step pills */}
        <div className="mb-8 flex justify-center gap-2">
          {([1, 2, 3] as const).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => n < step && setStep(n)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest",
                step === n
                  ? "bg-stitch-primary text-stitch-on-primary"
                  : n < step
                  ? "bg-stitch-secondary/20 text-stitch-secondary"
                  : "bg-stitch-surface-container-low text-stitch-outline"
              )}
            >
              {stepLabel[n]}
            </button>
          ))}
        </div>

        {/* ── Step 1 ── */}
        {step === 1 && (
          <section className="space-y-4">
            <ul className="space-y-3">
              {lines.map((l) => (
                <li key={l.item.id} className="flex items-center gap-3 rounded-2xl border border-stitch-outline-variant/20 bg-stitch-surface-container-lowest p-3">
                  <span className="text-3xl">{l.item.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold leading-snug">{l.item.title}</p>
                    <p className="text-xs text-stitch-on-surface-variant">GH₵ {l.item.priceGhs.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => updateQuantity(l.item.id, l.quantity - 1)} className="flex h-7 w-7 items-center justify-center rounded-full border border-stitch-outline-variant text-sm font-bold">−</button>
                    <span className="w-5 text-center text-sm font-bold">{l.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(l.item.id, l.quantity + 1)} className="flex h-7 w-7 items-center justify-center rounded-full bg-stitch-primary text-sm font-bold text-stitch-on-primary">+</button>
                    <button type="button" onClick={() => removeItem(l.item.id)} className="ml-1 text-red-500 hover:text-red-700" aria-label="Remove item">
                      <MaterialIcon name="delete" className="!text-base" />
                    </button>
                  </div>
                  <span className="min-w-[4rem] text-right text-sm font-bold text-stitch-primary">GH₵ {(l.item.priceGhs * l.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between rounded-xl bg-stitch-primary/10 px-4 py-3 text-sm font-bold">
              <span>Total</span>
              <span className="text-stitch-primary">GH₵ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <Link href="/menu" className="rounded-full border border-stitch-outline-variant px-6 py-2 text-sm font-bold">← Edit Menu</Link>
              <button type="button" onClick={() => setStep(2)} className="rounded-full bg-stitch-primary px-8 py-3 text-sm font-bold text-stitch-on-primary">Continue</button>
            </div>
          </section>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <section className="space-y-4">
            <div className="space-y-3 rounded-2xl border border-stitch-outline-variant/20 p-6">
              {[
                { label: "Full Name *",          value: name,  set: setName,  type: "text",  placeholder: "e.g. Kwame Asante" },
                { label: "Phone Number *",        value: phone, set: setPhone, type: "tel",   placeholder: "e.g. 0245123456" },
                { label: "Email (optional — creates account)", value: email, set: setEmail, type: "email", placeholder: "you@example.com" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-stitch-secondary">{f.label}</label>
                  <input type={f.type} value={f.value} onChange={(e) => f.set(e.target.value)} placeholder={f.placeholder}
                    className="w-full rounded-xl border border-stitch-outline-variant bg-stitch-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-stitch-primary/30" />
                </div>
              ))}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-stitch-secondary">Order Notes (optional)</label>
                <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Special instructions, allergies…"
                  className="w-full rounded-xl border border-stitch-outline-variant bg-stitch-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-stitch-primary/30" />
              </div>
            </div>
            <div className="flex justify-between gap-3">
              <button type="button" onClick={() => setStep(1)} className="rounded-full border border-stitch-outline-variant px-6 py-2 text-sm font-bold">Back</button>
              <button type="button" disabled={!name.trim() || !phone.trim()} onClick={() => setStep(3)} className="rounded-full bg-stitch-primary px-8 py-3 text-sm font-bold text-stitch-on-primary disabled:opacity-40">Continue</button>
            </div>
          </section>
        )}

        {/* ── Step 3 ── */}
        {step === 3 && (
          <section className="space-y-4">
            {/* Summary */}
            <div className="rounded-2xl border border-stitch-outline-variant/20 bg-stitch-surface-container-low p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-stitch-secondary">Order Summary</p>
              <ul className="space-y-1 text-sm">
                {lines.map((l) => (
                  <li key={l.item.id} className="flex justify-between">
                    <span>{l.quantity}× {l.item.title}</span>
                    <span>GH₵ {(l.item.priceGhs * l.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex justify-between border-t pt-2 text-sm font-bold">
                <span>Total</span>
                <span className="text-stitch-primary">GH₵ {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment */}
            <div className="space-y-3 rounded-2xl border border-stitch-outline-variant/20 p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-stitch-secondary">Payment Method</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {PAYMENT_METHODS.map((m) => (
                  <button key={m.value} type="button" onClick={() => setMethod(m.value)}
                    className={cn("rounded-xl border p-3 text-left text-xs transition-all",
                      method === m.value ? "border-stitch-primary bg-stitch-primary/10 font-bold" : "border-stitch-outline-variant/30")}>
                    <p className="font-bold">{m.label}</p>
                    <p className="text-stitch-on-surface-variant">{m.number}</p>
                  </button>
                ))}
              </div>
              <p className="text-xs text-stitch-on-surface-variant">
                Send <span className="font-bold text-stitch-primary">GH₵ {total.toFixed(2)}</span> to the number above, then fill in your receipt details below.
              </p>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-stitch-secondary">Payment Reference *</label>
                <input type="text" value={reference} onChange={(e) => setRef(e.target.value)} placeholder="Transaction ID or reference number"
                  className="w-full rounded-xl border border-stitch-outline-variant bg-stitch-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-stitch-primary/30" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-stitch-secondary">Payment Screenshot *</label>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setShot(e.target.files?.[0] ?? null)} />
                <button type="button" onClick={() => fileRef.current?.click()}
                  className={cn("flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed py-4 text-sm font-semibold transition-colors",
                    screenshot ? "border-green-400 bg-green-50 text-green-700" : "border-stitch-outline-variant text-stitch-on-surface-variant hover:border-stitch-primary/50")}>
                  <MaterialIcon name={screenshot ? "check_circle" : "cloud_upload"} className="!text-xl" />
                  {screenshot ? screenshot.name : "Upload MoMo / Bank Screenshot"}
                </button>
              </div>
            </div>

            <div className="flex justify-between gap-3">
              <button type="button" onClick={() => setStep(2)} className="rounded-full border border-stitch-outline-variant px-6 py-2 text-sm font-bold">Back</button>
              <button type="button" disabled={submitting || !reference.trim() || !screenshot} onClick={handleSubmit}
                className="rounded-full bg-gradient-to-br from-stitch-primary to-stitch-primary-container px-10 py-4 text-sm font-bold uppercase tracking-widest text-stitch-on-primary disabled:opacity-40">
                {submitting ? "Placing Order…" : "Place Order & WhatsApp Vendor"}
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
