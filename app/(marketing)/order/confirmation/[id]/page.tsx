"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { MaterialIcon } from "@/components/home/material-icon";

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const search = useSearchParams();
  const waUrl  = search.get("wa") ?? "";
  const opened = useRef(false);

  // Auto-open WhatsApp once on mount — works on mobile without popup blocker
  useEffect(() => {
    if (waUrl && !opened.current) {
      opened.current = true;
      window.location.href = waUrl; // redirects to WhatsApp app on mobile, web on desktop
    }
  }, [waUrl]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-stitch-surface px-6 text-center">
      <span className="text-6xl">🎉</span>
      <h1 className="font-display text-3xl text-orange-900">Order Placed!</h1>
      <p className="max-w-sm text-sm leading-relaxed text-stitch-on-surface-variant">
        Your order <span className="font-mono text-xs font-bold">{params.id.slice(0, 8)}…</span> has
        been saved. Tap the button below to send your payment details to the vendor on WhatsApp.
      </p>

      {waUrl && (
        <a
          href={waUrl}
          className="flex items-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-90 active:scale-95"
        >
          <MaterialIcon name="chat" className="text-white" />
          Confirm Order on WhatsApp
        </a>
      )}

      <p className="text-sm text-stitch-on-surface-variant">
        Questions? Call us on{" "}
        <a href="tel:+233545761374" className="font-bold text-stitch-primary">0545761374</a>
      </p>

      <Link
        href="/menu"
        className="rounded-full border border-stitch-outline-variant px-8 py-3 text-sm font-bold text-stitch-on-surface transition-colors hover:bg-stitch-surface-container-low"
      >
        Order More Food
      </Link>
    </div>
  );
}
