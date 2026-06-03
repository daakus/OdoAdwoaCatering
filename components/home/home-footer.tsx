import Link from "next/link";
import { MaterialIcon } from "@/components/home/material-icon";
import { SITE_NAME, OPERATING_SCHEDULE } from "@/lib/constants/site";

export function HomeFooter() {
  return (
    <footer className="mx-auto mt-20 grid w-full max-w-7xl grid-cols-1 gap-12 px-8 py-16 md:grid-cols-4">
      <div>
        <span className="mb-1 block font-headline text-xl font-bold text-orange-900">Odo Adwoa</span>
        <span className="mb-4 block font-headline text-sm italic text-orange-700">Catering Services</span>
        <p className="mb-2 font-body text-sm leading-relaxed text-stitch-on-surface-variant">
          Traditional Taste, Quality &amp; Satisfaction!
        </p>
        <p className="mb-6 font-body text-xs italic text-stitch-on-surface-variant/70">
          Deliciously Made. Freshly Served. Always the Best!
        </p>
        <a href="https://wa.me/233545761374" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90">
          <MaterialIcon name="chat" className="!text-sm" />
          WhatsApp Us
        </a>
      </div>

      <div>
        <h4 className="mb-6 text-xs font-bold uppercase tracking-widest">Order</h4>
        <ul className="space-y-4 font-body text-sm">
          {[
            { href: "/menu",     label: "Browse Menu" },
            { href: "/order",    label: "Checkout" },
            { href: "/events",   label: "Event Catering" },
            { href: "/customer", label: "My Orders" },
          ].map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="opacity-70 transition-all duration-300 hover:text-orange-700 hover:opacity-100">{l.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="mb-6 text-xs font-bold uppercase tracking-widest">Legal</h4>
        <ul className="space-y-4 font-body text-sm">
          {[
            { href: "/privacy", label: "Privacy Policy" },
            { href: "/terms",   label: "Terms of Service" },
            { href: "/contact", label: "Contact Us" },
          ].map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="opacity-70 transition-all duration-300 hover:text-orange-700 hover:opacity-100">{l.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="mb-6 text-xs font-bold uppercase tracking-widest">Service Hours</h4>
        <div className="flex items-start gap-2 font-body text-sm text-stitch-on-surface-variant">
          <MaterialIcon name="schedule" className="mt-0.5 !text-base text-stitch-primary" />
          <p className="leading-relaxed">
            {OPERATING_SCHEDULE.days.join(", ")}<br />
            {OPERATING_SCHEDULE.openTime} – {OPERATING_SCHEDULE.closeTime}
          </p>
        </div>
        <div className="mt-6 flex items-start gap-2 font-body text-sm text-stitch-on-surface-variant">
          <MaterialIcon name="phone" className="mt-0.5 !text-base text-stitch-primary" />
          <a href="tel:+233545761374" className="hover:text-orange-700">0545761374</a>
        </div>
      </div>

      <div className="border-t border-stitch-outline-variant/10 pt-12 text-center text-xs opacity-50 md:col-span-4">
        © {new Date().getFullYear()} {SITE_NAME}. Traditional Taste, Quality &amp; Satisfaction.
      </div>
    </footer>
  );
}
