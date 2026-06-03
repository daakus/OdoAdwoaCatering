import Link from "next/link";
import { HomeFooter } from "@/components/home/home-footer";
import { HomeHero } from "@/components/home/home-hero";
import { HomeTopNav } from "@/components/home/home-top-nav";
import { MobileBottomNav } from "@/components/home/mobile-bottom-nav";
import { WhatsAppFloat } from "@/components/home/whatsapp-float";
import { MENU_ITEMS, EVENT_PACKAGES } from "@/lib/constants/menu-catalog";
import { OPERATING_SCHEDULE } from "@/lib/constants/site";

const featuredItems = MENU_ITEMS.filter((i) => i.badge === "Popular").slice(0, 4);

export function HomePageView() {
  return (
    <div className="min-h-dvh bg-stitch-surface text-stitch-on-surface selection:bg-stitch-primary-fixed">
      <HomeTopNav />
      <main className="pb-28 md:pb-0">
        <HomeHero />

        {/* ── Featured Menu Items ── */}
        <section className="mx-auto max-w-6xl px-6 py-20 md:px-8">
          <div className="mb-10 text-center">
            <span className="font-label text-[10px] font-semibold uppercase tracking-[0.3em] text-stitch-secondary">Popular Today</span>
            <h2 className="mt-2 font-display text-3xl text-orange-900 md:text-4xl">Our Best Sellers</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {featuredItems.map((item) => (
              <Link key={item.id} href="/menu"
                className="group flex flex-col rounded-2xl border border-stitch-outline-variant/20 bg-stitch-surface-container-lowest p-4 shadow-card transition-shadow hover:shadow-soft">
                <span className="mb-3 text-4xl">{item.emoji}</span>
                <h3 className="font-headline text-sm font-bold text-orange-900">{item.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-stitch-on-surface-variant">{item.description}</p>
                <p className="mt-2 text-sm font-bold text-stitch-primary">GH₵ {item.priceGhs}</p>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/menu" className="inline-flex items-center gap-2 rounded-full bg-stitch-primary px-8 py-4 font-bold text-stitch-on-primary transition-opacity hover:opacity-90">
              View Full Menu →
            </Link>
          </div>
        </section>

        {/* ── Operating Hours Banner ── */}
        <section className="bg-gradient-to-r from-amber-900 to-orange-800 px-6 py-10 text-center text-white">
          <p className="font-label text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-300">We Are Open</p>
          <h2 className="mt-2 font-display text-2xl md:text-3xl">{OPERATING_SCHEDULE.displayString}</h2>
          <p className="mt-2 text-sm text-amber-100/80">
            Call / Order: <a href="tel:+233545761374" className="font-bold text-amber-300 underline">0545761374</a>
          </p>
        </section>

        {/* ── Event Catering CTA ── */}
        <section className="mx-auto max-w-6xl px-6 py-20 md:px-8">
          <div className="rounded-3xl bg-stitch-surface-container p-8 md:flex md:items-center md:gap-12">
            <div className="mb-6 text-5xl md:mb-0">🎊</div>
            <div className="flex-1">
              <span className="font-label text-[10px] font-semibold uppercase tracking-[0.3em] text-stitch-secondary">Weddings · Funerals · Parties</span>
              <h2 className="mt-2 font-display text-2xl text-orange-900 md:text-3xl">Planning a Big Event?</h2>
              <p className="mt-3 text-sm leading-relaxed text-stitch-on-surface-variant">
                We provide full-scale catering for weddings, funerals, corporate events, and parties. Choose from our kenkey buffet, protein grill stations, and local drinks bar packages. Starting from GH₵ {EVENT_PACKAGES[0].pricePerHeadGhs}/head.
              </p>
            </div>
            <Link href="/events" className="mt-6 block rounded-full bg-stitch-primary px-8 py-4 text-center text-sm font-bold text-stitch-on-primary transition-opacity hover:opacity-90 md:mt-0 md:shrink-0">
              Book Event Catering →
            </Link>
          </div>
        </section>

        {/* ── Why Choose Us ── */}
        <section className="bg-stitch-surface-container-low px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <h2 className="font-display text-2xl text-orange-900 md:text-3xl">Why Odo Adwoa?</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { emoji: "🌽", title: "Traditional Recipes",    body: "Authentic Ghanaian millet kenkey made from time-tested family recipes — never compromised." },
                { emoji: "🔥", title: "Freshly Prepared",       body: "Every order is cooked fresh on the day. We never serve day-old food." },
                { emoji: "📲", title: "Easy MoMo Payments",     body: "Pay via MTN MoMo, Vodafone Cash, or AirtelTigo Money and confirm instantly on WhatsApp." },
              ].map((c) => (
                <div key={c.title} className="rounded-2xl bg-stitch-surface-container-lowest p-6 text-center shadow-card">
                  <span className="text-4xl">{c.emoji}</span>
                  <h3 className="mt-3 font-headline text-base font-bold text-orange-900">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stitch-on-surface-variant">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <HomeFooter />
      <MobileBottomNav />
      <WhatsAppFloat />
    </div>
  );
}
