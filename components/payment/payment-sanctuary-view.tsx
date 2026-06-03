"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef } from "react";
import { PAYMENT_MERCHANTS } from "@/lib/constants/payment-merchants";
import { SITE_NAME } from "@/lib/constants/site";
import { HomeTopNav } from "@/components/home/home-top-nav";
import { MaterialIcon } from "@/components/home/material-icon";
import { cn } from "@/lib/utils";

const PAYMENT_HERO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCWkyolddL29vyj-tRE0RqB70UHf-KjAkojP6rBmESbOXs-BvX-i8V62c3DRRDjtlUFZrbf7wSxaizDGQR05GXOfmkXS8esn8BhANA0TG7MSGMVMA-mV0CbLm588e6BAgFbRB05qej-bxy1zzftgNzELUsTbisjI92HMUTxdIiGIOPT3srakTkP0Zqhj4_AFM73psDJfflG_9Mi9PxcI-XeghTcnP5B5Z-RfI4NrKUHbtvL2c2WtV2y8a1zIGrkzRjb37ZbqbvKU0b3";

function PaymentMobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-3xl bg-stitch-surface/80 px-4 pb-6 pt-3 shadow-nav-up backdrop-blur-xl md:hidden">
      <Link
        href="/"
        className="flex flex-col items-center justify-center text-orange-800/50"
      >
        <MaterialIcon name="home" />
        <span className="mt-1 font-body text-[10px] uppercase tracking-[0.1rem]">Home</span>
      </Link>
      <Link
        href="/services"
        className="flex flex-col items-center justify-center text-orange-800/50"
      >
        <MaterialIcon name="spa" />
        <span className="mt-1 font-body text-[10px] uppercase tracking-[0.1rem]">Services</span>
      </Link>
      <Link
        href="/payment-instructions"
        className="flex flex-col items-center justify-center rounded-2xl bg-orange-100 px-4 py-1 text-orange-900"
      >
        <MaterialIcon name="event_note" />
        <span className="mt-1 font-body text-[10px] uppercase tracking-[0.1rem]">Bookings</span>
      </Link>
      <Link
        href="/customer"
        className="flex flex-col items-center justify-center text-orange-800/50"
      >
        <MaterialIcon name="person" />
        <span className="mt-1 font-body text-[10px] uppercase tracking-[0.1rem]">Profile</span>
      </Link>
    </nav>
  );
}

export function PaymentSanctuaryView() {
  const search = useSearchParams();
  const fileRef = useRef<HTMLInputElement>(null);

  const ref = search.get("ref") ?? "ALX-9982";
  const serviceName = search.get("service") ?? "Signature Glow Facial";
  const subtotal = Number(search.get("subtotal") ?? "350");
  const taxParam = search.get("tax");
  const taxVal = taxParam !== null && taxParam !== "" ? Number(taxParam) : null;
  const totalParam = search.get("total");
  const totalFromBooking =
    totalParam !== null && totalParam !== "" ? Number(totalParam) : null;
  const extraName = search.get("extra");
  const extraPriceRaw = search.get("extraPrice");
  const showExtraLine = Boolean(extraName && extraPriceRaw);
  const extraPrice = showExtraLine ? Number(extraPriceRaw) : 0;

  const fromBookingWizard = taxVal !== null && !Number.isNaN(taxVal);
  const total = fromBookingWizard
    ? totalFromBooking ?? subtotal + taxVal!
    : showExtraLine
      ? subtotal + extraPrice
      : subtotal + 120;

  return (
    <div className="min-h-dvh bg-stitch-background font-body text-stitch-on-background selection:bg-stitch-primary-fixed selection:text-stitch-on-primary-fixed">
      <HomeTopNav />

      <main className="mx-auto max-w-7xl px-6 pb-28 pt-32 md:px-12 md:pb-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <section className="lg:col-span-7">
            <header className="mb-12">
              <span className="mb-4 block font-label text-sm uppercase tracking-[0.2rem] text-stitch-secondary">
                Secure Payment
              </span>
              <h1 className="mb-6 font-headline text-5xl leading-tight text-stitch-on-surface md:text-6xl">
                Finalize Your <br />
                <span className="italic">Sanctuary Experience</span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-stitch-on-surface-variant">
                To confirm your appointment, please follow the mobile money instructions below.
                Your relaxation begins the moment you settle your booking.
              </p>
            </header>

            <div className="space-y-6">
              <div className="rounded-xl bg-stitch-surface-container-low p-8">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="font-headline text-2xl">Payment Methods</h2>
                  <div className="flex gap-4 text-stitch-secondary">
                    <MaterialIcon name="verified_user" className="text-3xl" />
                    <MaterialIcon name="lock" className="text-3xl" />
                  </div>
                </div>
                <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
                  {PAYMENT_MERCHANTS.map((m) => (
                    <div
                      key={m.id}
                      className={cn(
                        "rounded-xl bg-stitch-surface-container-lowest p-6 text-center",
                        "border-b-4",
                        m.borderClass
                      )}
                    >
                      <div className="mb-1 text-lg font-bold">{m.label}</div>
                      <div className="font-label text-xs opacity-60">Merchant: {m.number}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-8">
                  <h3 className="font-label text-xs uppercase tracking-widest text-stitch-outline">
                    Step-by-Step Instructions
                  </h3>
                  {[
                    {
                      n: "1",
                      t: "Dial the Shortcode",
                      d: "MTN: *170# | Vodafone: *110# | AirtelTigo: *110#",
                    },
                    {
                      n: "2",
                      t: "Enter Merchant Number",
                      d: "Select Pay Merchant and enter the number for your provider above.",
                    },
                    {
                      n: "3",
                      t: "Enter Amount & Reference",
                      d: `Enter the exact service amount. Use your Booking ID ${ref} as the payment reference.`,
                    },
                  ].map((step) => (
                    <div key={step.n} className="flex items-start gap-6">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stitch-primary-fixed font-headline text-stitch-primary">
                        {step.n}
                      </div>
                      <div>
                        <h4 className="mb-1 font-bold">{step.t}</h4>
                        <p className="text-sm text-stitch-on-surface-variant">{step.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center gap-8 rounded-xl border border-stitch-outline-variant/15 bg-stitch-surface-container-lowest p-8 shadow-sm md:flex-row">
                <div className="flex-1">
                  <h3 className="mb-2 font-headline text-xl">Proof of Payment</h3>
                  <p className="text-sm text-stitch-on-surface-variant">
                    Upload a clear screenshot of your payment confirmation to speed up
                    verification.
                  </p>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-stitch-primary px-8 py-3 font-bold text-stitch-primary transition-all hover:bg-stitch-primary hover:text-stitch-on-primary md:w-auto"
                >
                  <MaterialIcon name="cloud_upload" />
                  Upload Screenshot
                </button>
              </div>
            </div>
          </section>

          <aside className="relative lg:col-span-5">
            <div className="sticky top-32 space-y-8">
              <div className="overflow-hidden rounded-2xl bg-stitch-surface-container-high">
                <div className="relative h-64 w-full">
                  <Image
                    src={PAYMENT_HERO}
                    alt="Spa treatment"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>
                <div className="p-8">
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <h3 className="font-headline text-xl">Booking Summary</h3>
                      <p className="text-sm opacity-60">ID: #{ref}</p>
                    </div>
                    <div className="rounded-full bg-stitch-secondary-fixed px-3 py-1 text-xs font-bold text-stitch-on-secondary-fixed-variant">
                      Pending Payment
                    </div>
                  </div>
                  <div className="mb-8 space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-stitch-on-surface-variant">{serviceName}</span>
                      <span className="font-bold">GHS {subtotal.toFixed(2)}</span>
                    </div>
                    {fromBookingWizard ? (
                      <div className="flex justify-between text-sm">
                        <span className="text-stitch-on-surface-variant">Service Tax (5%)</span>
                        <span className="font-bold">GHS {taxVal!.toFixed(2)}</span>
                      </div>
                    ) : showExtraLine ? (
                      <div className="flex justify-between text-sm">
                        <span className="text-stitch-on-surface-variant">{extraName}</span>
                        <span className="font-bold">GHS {extraPrice.toFixed(2)}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between text-sm">
                        <span className="text-stitch-on-surface-variant">Luxury Manicure</span>
                        <span className="font-bold">GHS 120.00</span>
                      </div>
                    )}
                    <div className="flex items-end justify-between border-t border-stitch-outline-variant/30 pt-4">
                      <span className="font-label text-xs uppercase tracking-widest">
                        Total Amount
                      </span>
                      <span className="font-headline text-3xl text-stitch-primary">
                        GHS {total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/booking/confirmation/demo"
                    className="glow-gradient flex w-full items-center justify-center gap-3 rounded-full py-5 text-lg font-bold text-stitch-on-primary shadow-xl transition-transform hover:scale-[1.02]"
                  >
                    I Have Paid
                    <MaterialIcon name="arrow_forward" />
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-stitch-primary-fixed/50 bg-stitch-primary-fixed/30 p-8">
                <div className="flex items-start gap-4">
                  <MaterialIcon name="info" className="text-3xl text-stitch-primary" />
                  <div>
                    <h4 className="font-bold text-stitch-primary">Calming Note</h4>
                    <p className="text-sm leading-relaxed text-stitch-on-primary-fixed-variant">
                      Payment verification typically takes 5–10 minutes. You will receive a
                      confirmation SMS and email once your slot is secured.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="mt-20 bg-stitch-surface-container-low text-orange-900">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-8 py-16 font-body text-sm leading-relaxed md:grid-cols-4">
          <div className="md:col-span-1">
            <span className="mb-4 block font-headline text-2xl italic">Odo Adwoa Catering</span>
            <p className="mb-6 opacity-70">
              Redefining elegance through the lens of traditional craftsmanship and modern
              luxury.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-2 opacity-70">
              <li>
                <Link href="/services" className="transition-colors hover:text-orange-700">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/booking" className="transition-colors hover:text-orange-700">
                  Booking
                </Link>
              </li>
              <li>
                <Link href="/customer" className="transition-colors hover:text-orange-700">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest">Legal</h4>
            <ul className="space-y-2 opacity-70">
              <li>
                <Link href="/privacy" className="transition-colors hover:text-orange-700">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-orange-700">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest">Support</h4>
            <ul className="space-y-2 opacity-70">
              <li>
                <Link href="/contact" className="transition-colors hover:text-orange-700">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="transition-colors hover:text-orange-700">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-7xl border-t border-stitch-outline-variant/10 px-8 py-8 text-center text-xs tracking-widest opacity-60">
          © {new Date().getFullYear()} {SITE_NAME}. Traditional Taste, Quality & Satisfaction.
        </div>
      </footer>

      <PaymentMobileNav />
    </div>
  );
}
