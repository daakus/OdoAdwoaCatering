import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Odo Adwoa Catering Services — Traditional Taste, Quality & Satisfaction. Serving Millet Kenkey, grilled proteins, local bar drinks and event catering in Ghana.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-24 sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-orange-900">Our Story</h1>
      <p className="leading-relaxed text-stitch-on-surface-variant">
        Odo Adwoa Catering Services was born from a love of authentic Ghanaian food. We
        specialise in freshly prepared Millet Kenkey, served with the classic sides you
        grew up with — gravy and fried fish, okra stew, shito, and hot peppers.
      </p>
      <p className="leading-relaxed text-stitch-on-surface-variant">
        We also offer grilled proteins (pork, tilapia, chicken), a wide variety of local
        bar drinks (Sobolo, Asana, Pito, Lamugin), and full event catering for weddings,
        funerals, parties, and corporate events.
      </p>
      <p className="leading-relaxed text-stitch-on-surface-variant">
        <strong>Deliciously Made. Freshly Served. Always the Best.</strong>
      </p>
      <div className="rounded-xl border border-stitch-outline-variant/20 bg-stitch-surface-container-low p-4 text-sm">
        <p className="font-bold text-orange-900">Service Hours</p>
        <p className="mt-1 text-stitch-on-surface-variant">Monday, Wednesday &amp; Friday · 11:00 AM – 4:00 PM</p>
        <p className="mt-2 font-bold text-orange-900">Call / WhatsApp</p>
        <p className="mt-1 text-stitch-on-surface-variant">
          <a href="tel:+233545761374" className="text-stitch-primary hover:underline">0545761374</a>
        </p>
      </div>
    </div>
  );
}
