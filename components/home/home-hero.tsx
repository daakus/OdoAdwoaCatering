import Link from "next/link";
import { OPERATING_SCHEDULE } from "@/lib/constants/site";
import { MaterialIcon } from "@/components/home/material-icon";

export function HomeHero() {
  return (
    <>
      {/* Desktop hero */}
      <header className="relative hidden min-h-[720px] items-center overflow-hidden bg-gradient-to-br from-amber-950 via-orange-900 to-yellow-800 pt-20 md:flex">
        <div className="pointer-events-none absolute inset-0 select-none overflow-hidden opacity-10">
          {["🌽", "🐟", "🥩", "🌶️", "🥤", "🍗", "🌽", "🐟"].map((e, i) => (
            <span key={i} className="absolute text-7xl" style={{ top: `${10 + (i * 11) % 80}%`, left: `${5 + (i * 13) % 90}%` }}>{e}</span>
          ))}
        </div>
        <div className="container relative z-10 mx-auto px-8">
          <div className="max-w-2xl">
            <span className="mb-6 inline-block rounded-full bg-white/15 px-4 py-1.5 font-label text-sm font-semibold uppercase tracking-[0.2rem] text-amber-200">
              Traditional Taste · Quality &amp; Satisfaction
            </span>
            <h1 className="mb-6 font-headline text-6xl leading-[1.1] tracking-tighter text-white md:text-7xl">
              Odo Adwoa <br />
              <i className="font-normal italic text-amber-300">Catering Services</i>
            </h1>
            <p className="mb-4 max-w-lg text-xl leading-relaxed text-amber-100/80">
              Ghana&apos;s favourite Millet Kenkey, grilled proteins, local bar drinks, and full event catering — delivered with love.
            </p>
            <p className="mb-10 flex items-center gap-2 text-sm text-amber-200/70">
              <MaterialIcon name="schedule" className="!text-base" />
              {OPERATING_SCHEDULE.displayString}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/menu" className="rounded-full bg-amber-400 px-10 py-5 text-lg font-bold text-amber-950 shadow-xl transition-transform hover:scale-105">
                Order Now 🛒
              </Link>
              <Link href="/events" className="rounded-full border border-white/25 bg-white/10 px-10 py-5 text-lg font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20">
                Book an Event
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile hero */}
      <section className="relative flex min-h-[600px] w-full flex-col justify-end overflow-hidden bg-gradient-to-b from-amber-900 to-orange-950 px-6 pb-12 pt-24 md:hidden">
        <div className="pointer-events-none absolute inset-0 select-none overflow-hidden opacity-10">
          {["🌽", "🐟", "🥩", "🌶️", "🥤"].map((e, i) => (
            <span key={i} className="absolute text-6xl" style={{ top: `${5 + i * 17}%`, left: `${10 + i * 18}%` }}>{e}</span>
          ))}
        </div>
        <div className="relative max-w-md">
          <span className="mb-4 inline-block rounded-full bg-amber-400/20 px-3 py-1 font-label text-[10px] font-semibold uppercase tracking-[0.2rem] text-amber-300">
            Deliciously Made · Freshly Served
          </span>
          <h2 className="mb-4 font-headline text-4xl leading-[1.1] text-white">
            Millet Kenkey <br />
            <i className="font-normal text-amber-300">&amp; Much More</i>
          </h2>
          <p className="mb-2 flex items-center gap-2 text-xs text-amber-200/70">
            <MaterialIcon name="schedule" className="!text-xs" />
            {OPERATING_SCHEDULE.displayString}
          </p>
          <p className="mb-8 text-sm leading-relaxed text-amber-100/80">
            From 50 Cedis · Grilled pork, tilapia, chicken · Sobolo, Asana &amp; more.
          </p>
          <div className="flex gap-3">
            <Link href="/menu" className="glow-gradient inline-flex items-center gap-2 rounded-full px-8 py-4 font-label text-sm font-bold tracking-wide text-amber-950 shadow-lg transition-transform active:scale-95">
              Order Now
              <MaterialIcon name="arrow_forward" size="sm" className="!text-lg" />
            </Link>
            <Link href="/events" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-4 font-label text-sm font-bold text-white transition-colors hover:bg-white/10">
              Events
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
