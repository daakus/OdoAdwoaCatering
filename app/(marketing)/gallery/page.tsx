import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: `Our Food | ${SITE_NAME}`,
  description: "See our Millet Kenkey, grilled proteins, local drinks, and event catering setups.",
};

export default function GalleryPage() {
  const emojis = ["🌽", "🐟", "🥩", "🍗", "🥤", "🌶️", "🥣", "🫙", "🌿", "💧", "🐠", "🎊"];
  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <div className="mb-10 text-center">
        <span className="font-label text-[10px] font-semibold uppercase tracking-[0.3em] text-stitch-secondary">Our Food</span>
        <h1 className="mt-2 font-display text-4xl text-orange-900">What We Serve</h1>
        <p className="mt-3 text-sm text-stitch-on-surface-variant">Deliciously Made. Freshly Served. Always the Best!</p>
      </div>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
        {emojis.map((e, i) => (
          <div key={i} className="flex aspect-square items-center justify-center rounded-2xl bg-stitch-surface-container text-5xl">
            {e}
          </div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link href="/menu" className="rounded-full bg-stitch-primary px-8 py-4 font-bold text-stitch-on-primary transition-opacity hover:opacity-90">
          View Our Menu & Order →
        </Link>
      </div>
    </div>
  );
}
