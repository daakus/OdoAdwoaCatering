import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Booking Confirmed — Odo Adwoa Catering" };

export default function EventConfirmationPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-stitch-surface px-6 text-center">
      <span className="text-6xl">🎊</span>
      <h1 className="font-display text-3xl text-orange-900">Event Booking Received!</h1>
      <p className="max-w-sm text-sm leading-relaxed text-stitch-on-surface-variant">
        Your event booking <span className="font-mono text-xs font-bold">{params.id.slice(0, 8)}…</span> has been saved.
        WhatsApp has been opened to send the full booking summary to the vendor for confirmation.
      </p>
      <p className="text-sm text-stitch-on-surface-variant">
        Questions? Call / WhatsApp:{" "}
        <a href="tel:+233545761374" className="font-bold text-stitch-primary">0545761374</a>
      </p>
      <div className="flex gap-3">
        <Link href="/" className="rounded-full border border-stitch-outline-variant px-6 py-3 text-sm font-bold">
          Back to Home
        </Link>
        <a href="https://wa.me/233545761374" target="_blank" rel="noopener noreferrer"
          className="rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white">
          Open WhatsApp
        </a>
      </div>
    </div>
  );
}
