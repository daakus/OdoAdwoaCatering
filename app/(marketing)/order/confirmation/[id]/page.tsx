import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Order Confirmed — Odo Adwoa Catering" };

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-stitch-surface px-6 text-center">
      <span className="text-6xl">🎉</span>
      <h1 className="font-display text-3xl text-orange-900">Order Placed!</h1>
      <p className="max-w-sm text-sm leading-relaxed text-stitch-on-surface-variant">
        Your order <span className="font-mono text-xs font-bold">{params.id.slice(0, 8)}…</span> has been saved.
        We have opened WhatsApp so you can confirm delivery details with the vendor.
      </p>
      <p className="text-sm text-stitch-on-surface-variant">
        Questions? Call us on{" "}
        <a href="tel:+233545761374" className="font-bold text-stitch-primary">0545761374</a>
      </p>
      <Link href="/menu" className="rounded-full bg-stitch-primary px-8 py-3 text-sm font-bold text-stitch-on-primary">
        Order More Food
      </Link>
    </div>
  );
}
