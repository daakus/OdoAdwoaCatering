"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { submitEventBooking } from "@/app/actions/event-booking";
import { buildEventWhatsAppUrl } from "@/lib/utils/whatsapp";
import { EVENT_TYPES, EVENT_PACKAGES, type EventType } from "@/lib/constants/menu-catalog";
import { MaterialIcon } from "@/components/home/material-icon";
import { cn } from "@/lib/utils";

const PAYMENT_METHODS = [
  { value: "mtn_momo",         label: "MTN MoMo",        number: process.env.NEXT_PUBLIC_MOMO_MTN_NUMBER ?? "0545761374" },
  { value: "vodafone_cash",    label: "Vodafone Cash",    number: process.env.NEXT_PUBLIC_MOMO_VODAFONE_NUMBER ?? "—" },
  { value: "airteltigo_money", label: "AirtelTigo Money", number: process.env.NEXT_PUBLIC_MOMO_AIRTELTIGO_NUMBER ?? "—" },
] as const;

type Step = 1 | 2 | 3;

export function EventBookingView() {
  const router  = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep]           = useState<Step>(1);
  const [eventType, setEventType] = useState<EventType>("Wedding");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [venue, setVenue]         = useState("");
  const [guestCount, setGuests]   = useState<number | "">("");
  const [selectedPkgs, setPkgs]   = useState<string[]>([]);

  const [name, setName]   = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [method, setMethod]   = useState<"mtn_momo" | "vodafone_cash" | "airteltigo_money">("mtn_momo");
  const [reference, setRef]   = useState("");
  const [deposit, setDeposit] = useState<number | "">("");
  const [screenshot, setShot] = useState<File | null>(null);
  const [submitting, setSub]  = useState(false);

  const togglePkg = (title: string) =>
    setPkgs((prev) => prev.includes(title) ? prev.filter((p) => p !== title) : [...prev, title]);

  const estimatedTotal =
    typeof guestCount === "number" && selectedPkgs.length > 0
      ? EVENT_PACKAGES.filter((p) => selectedPkgs.includes(p.title))
          .reduce((sum, p) => sum + p.pricePerHeadGhs * (guestCount as number), 0)
      : 0;

  const handleSubmit = async () => {
    if (!name.trim())      return toast.error("Enter your name.");
    if (!phone.trim())     return toast.error("Enter your phone number.");
    if (!reference.trim()) return toast.error("Enter your payment reference.");
    if (!screenshot)       return toast.error("Upload proof of deposit payment.");

    setSub(true);
    const fd = new FormData();
    fd.set("customer_name",     name.trim());
    fd.set("customer_phone",    phone.trim());
    fd.set("customer_email",    email.trim());
    fd.set("event_type",        eventType);
    fd.set("event_date",        eventDate);
    fd.set("event_time",        eventTime);
    fd.set("venue",             venue.trim());
    fd.set("guest_count",       String(guestCount));
    fd.set("selected_packages", JSON.stringify(selectedPkgs));
    fd.set("deposit_amount",    String(typeof deposit === "number" ? deposit : 0));
    fd.set("payment_method",    method);
    fd.set("payment_reference", reference.trim());
    fd.set("notes",             notes.trim());
    fd.set("payment_screenshot", screenshot);

    const res = await submitEventBooking(fd);
    setSub(false);

    if ("error" in res && res.error) { toast.error(res.error); return; }

    if ("success" in res && res.success) {
      const waUrl = buildEventWhatsAppUrl({
        eventType,
        customerName:     name.trim(),
        customerPhone:    phone.trim(),
        eventDate,
        eventTime,
        venue:            venue.trim(),
        guestCount:       typeof guestCount === "number" ? guestCount : 0,
        selectedPackages: selectedPkgs,
        depositPaid:      typeof deposit === "number" ? deposit : 0,
        receiptUrl:       res.receiptUrl,
      });
      toast.success("Booking saved! Opening WhatsApp to confirm with vendor…");
      setTimeout(() => {
        window.open(waUrl, "_blank");
        router.push(`/events/confirmation/${res.bookingId}`);
      }, 800);
    }
  };

  const stepLabel: Record<Step, string> = { 1: "Event Details", 2: "Your Details", 3: "Deposit & Payment" };

  return (
    <div className="min-h-screen bg-stitch-surface pb-28 pt-24 text-stitch-on-surface">
      <div className="mx-auto max-w-2xl px-4 md:px-8">
        <header className="mb-8 text-center">
          <span className="font-label text-[10px] uppercase tracking-[0.3em] text-stitch-secondary">Event Catering</span>
          <h1 className="mt-2 font-display text-3xl text-orange-900 md:text-4xl">Book Your Event</h1>
          <p className="mt-2 text-sm text-stitch-on-surface-variant">Weddings · Funerals · Parties · Corporate Events</p>
        </header>

        {/* Step pills */}
        <div className="mb-8 flex justify-center gap-2">
          {([1, 2, 3] as const).map((n) => (
            <button key={n} type="button" onClick={() => n < step && setStep(n)}
              className={cn("rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest",
                step === n ? "bg-stitch-primary text-stitch-on-primary"
                  : n < step ? "bg-stitch-secondary/20 text-stitch-secondary"
                  : "bg-stitch-surface-container-low text-stitch-outline")}>
              {stepLabel[n]}
            </button>
          ))}
        </div>

        {/* ── Step 1: Event Details ── */}
        {step === 1 && (
          <section className="space-y-5">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-stitch-secondary">Event Type *</p>
              <div className="flex flex-wrap gap-2">
                {EVENT_TYPES.map((et) => (
                  <button key={et} type="button" onClick={() => setEventType(et)}
                    className={cn("rounded-full border px-4 py-2 text-sm font-bold transition-all",
                      eventType === et ? "border-stitch-primary bg-stitch-primary text-stitch-on-primary" : "border-stitch-outline-variant/40 hover:border-stitch-primary/40")}>
                    {et}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-stitch-secondary">Event Date *</label>
                <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)}
                  className="w-full rounded-xl border border-stitch-outline-variant bg-stitch-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-stitch-primary/30" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-stitch-secondary">Start Time *</label>
                <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)}
                  className="w-full rounded-xl border border-stitch-outline-variant bg-stitch-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-stitch-primary/30" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-stitch-secondary">Venue / Location *</label>
              <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="e.g. Community Centre, Tema — Hall 2"
                className="w-full rounded-xl border border-stitch-outline-variant bg-stitch-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-stitch-primary/30" />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-stitch-secondary">Estimated Guest Count *</label>
              <input type="number" min={1} value={guestCount} onChange={(e) => setGuests(e.target.value ? parseInt(e.target.value) : "")} placeholder="e.g. 250"
                className="w-full rounded-xl border border-stitch-outline-variant bg-stitch-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-stitch-primary/30" />
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-stitch-secondary">Menu Packages (select all that apply)</p>
              <ul className="space-y-3">
                {EVENT_PACKAGES.map((pkg) => {
                  const on = selectedPkgs.includes(pkg.title);
                  const estimated = typeof guestCount === "number" ? pkg.pricePerHeadGhs * guestCount : null;
                  return (
                    <li key={pkg.id}>
                      <button type="button" onClick={() => togglePkg(pkg.title)}
                        className={cn("w-full rounded-2xl border p-4 text-left transition-all",
                          on ? "border-stitch-primary bg-stitch-primary/10" : "border-stitch-outline-variant/20 hover:border-stitch-primary/30")}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-headline text-sm font-bold text-orange-900">{pkg.title}</p>
                            <p className="mt-1 text-xs text-stitch-on-surface-variant">{pkg.description}</p>
                            <p className="mt-2 text-xs font-bold text-stitch-primary">
                              GH₵ {pkg.pricePerHeadGhs}/head · min {pkg.minGuests} guests
                              {estimated ? ` · ~GH₵ ${estimated.toLocaleString()} total` : ""}
                            </p>
                          </div>
                          <MaterialIcon name={on ? "check_circle" : "radio_button_unchecked"} className="text-stitch-primary" />
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {estimatedTotal > 0 && (
              <div className="rounded-xl bg-stitch-primary/10 px-4 py-3 text-sm font-bold">
                Estimated Total: GH₵ {estimatedTotal.toLocaleString()}
                <span className="ml-2 text-xs font-normal text-stitch-on-surface-variant">(based on {guestCount} guests)</span>
              </div>
            )}

            <div className="flex justify-end">
              <button type="button" disabled={!eventDate || !eventTime || !venue.trim() || !guestCount} onClick={() => setStep(2)}
                className="rounded-full bg-stitch-primary px-8 py-3 text-sm font-bold text-stitch-on-primary disabled:opacity-40">
                Continue
              </button>
            </div>
          </section>
        )}

        {/* ── Step 2: Your Details ── */}
        {step === 2 && (
          <section className="space-y-4">
            <div className="space-y-3 rounded-2xl border border-stitch-outline-variant/20 p-6">
              {[
                { label: "Full Name *",      value: name,  set: setName,  type: "text",  placeholder: "e.g. Abena Mensah" },
                { label: "Phone Number *",   value: phone, set: setPhone, type: "tel",   placeholder: "e.g. 0244567890" },
                { label: "Email (optional)", value: email, set: setEmail, type: "email", placeholder: "you@example.com" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-stitch-secondary">{f.label}</label>
                  <input type={f.type} value={f.value} onChange={(e) => f.set(e.target.value)} placeholder={f.placeholder}
                    className="w-full rounded-xl border border-stitch-outline-variant bg-stitch-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-stitch-primary/30" />
                </div>
              ))}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-stitch-secondary">Additional Notes</label>
                <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special dietary requirements, décor preferences, custom menu requests…"
                  className="w-full rounded-xl border border-stitch-outline-variant bg-stitch-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-stitch-primary/30" />
              </div>
            </div>
            <div className="flex justify-between gap-3">
              <button type="button" onClick={() => setStep(1)} className="rounded-full border border-stitch-outline-variant px-6 py-2 text-sm font-bold">Back</button>
              <button type="button" disabled={!name.trim() || !phone.trim()} onClick={() => setStep(3)} className="rounded-full bg-stitch-primary px-8 py-3 text-sm font-bold text-stitch-on-primary disabled:opacity-40">Continue</button>
            </div>
          </section>
        )}

        {/* ── Step 3: Deposit & Payment ── */}
        {step === 3 && (
          <section className="space-y-4">
            <div className="rounded-2xl border border-stitch-outline-variant/20 bg-stitch-surface-container-low p-4 text-sm">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-stitch-secondary">Booking Summary</p>
              <p><span className="font-bold">Event:</span> {eventType}</p>
              <p><span className="font-bold">Date:</span> {eventDate} at {eventTime}</p>
              <p><span className="font-bold">Venue:</span> {venue}</p>
              <p><span className="font-bold">Guests:</span> {guestCount}</p>
              {selectedPkgs.length > 0 && <ul className="mt-1">{selectedPkgs.map((p) => <li key={p} className="text-stitch-on-surface-variant">· {p}</li>)}</ul>}
              {estimatedTotal > 0 && <p className="mt-2 font-bold text-stitch-primary">Estimated Total: GH₵ {estimatedTotal.toLocaleString()}</p>}
            </div>

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
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-stitch-secondary">Deposit Amount Paid (GH₵) *</label>
                <input type="number" min={0} value={deposit} onChange={(e) => setDeposit(e.target.value ? parseFloat(e.target.value) : "")} placeholder="e.g. 500"
                  className="w-full rounded-xl border border-stitch-outline-variant bg-stitch-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-stitch-primary/30" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-stitch-secondary">Payment Reference *</label>
                <input type="text" value={reference} onChange={(e) => setRef(e.target.value)} placeholder="Transaction ID / reference number"
                  className="w-full rounded-xl border border-stitch-outline-variant bg-stitch-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-stitch-primary/30" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-stitch-secondary">Proof of Deposit Screenshot *</label>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setShot(e.target.files?.[0] ?? null)} />
                <button type="button" onClick={() => fileRef.current?.click()}
                  className={cn("flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed py-4 text-sm font-semibold transition-colors",
                    screenshot ? "border-green-400 bg-green-50 text-green-700" : "border-stitch-outline-variant text-stitch-on-surface-variant hover:border-stitch-primary/50")}>
                  <MaterialIcon name={screenshot ? "check_circle" : "cloud_upload"} className="!text-xl" />
                  {screenshot ? screenshot.name : "Upload MoMo / Bank Receipt"}
                </button>
              </div>
            </div>

            <div className="flex justify-between gap-3">
              <button type="button" onClick={() => setStep(2)} className="rounded-full border border-stitch-outline-variant px-6 py-2 text-sm font-bold">Back</button>
              <button type="button" disabled={submitting || !reference.trim() || !screenshot} onClick={handleSubmit}
                className="rounded-full bg-gradient-to-br from-stitch-primary to-stitch-primary-container px-10 py-4 text-sm font-bold uppercase tracking-widest text-stitch-on-primary disabled:opacity-40">
                {submitting ? "Submitting…" : "Submit Booking & WhatsApp Vendor"}
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
