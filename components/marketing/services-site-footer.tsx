import Link from "next/link";
import { MaterialIcon } from "@/components/home/material-icon";
import { SITE_NAME } from "@/lib/constants/site";

export function ServicesSiteFooter() {
  return (
    <footer className="mx-auto mt-20 grid w-full max-w-7xl grid-cols-1 gap-12 border-t-0 bg-stitch-surface-container-low px-8 py-16 md:grid-cols-4">
      <div className="md:col-span-1">
        <span className="mb-4 block font-headline text-2xl italic text-orange-900">
          Odo Adwoa Catering
        </span>
        <p className="font-body text-sm leading-relaxed text-orange-900/70">
          Traditional Taste, Quality & Satisfaction. Authentic Ghanaian kenkey and catering for every occasion.
        </p>
      </div>
      <div>
        <h4 className="mb-6 font-bold text-orange-900">Discover</h4>
        <ul className="flex flex-col gap-4">
          <li>
            <Link
              href="/services"
              className="text-sm opacity-70 transition-all hover:text-orange-700 hover:opacity-100"
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="text-sm opacity-70 transition-all hover:text-orange-700 hover:opacity-100"
            >
              Our Story
            </Link>
          </li>
          <li>
            <Link
              href="/gallery"
              className="text-sm opacity-70 transition-all hover:text-orange-700 hover:opacity-100"
            >
              Lookbook
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <h4 className="mb-6 font-bold text-orange-900">Resources</h4>
        <ul className="flex flex-col gap-4">
          <li>
            <Link
              href="/privacy"
              className="text-sm font-bold underline opacity-70 transition-all hover:text-orange-700 hover:opacity-100"
            >
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link
              href="/terms"
              className="text-sm opacity-70 transition-all hover:text-orange-700 hover:opacity-100"
            >
              Terms of Service
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="text-sm opacity-70 transition-all hover:text-orange-700 hover:opacity-100"
            >
              Contact Us
            </Link>
          </li>
          <li>
            <Link
              href="/careers"
              className="text-sm opacity-70 transition-all hover:text-orange-700 hover:opacity-100"
            >
              Careers
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <h4 className="mb-6 font-bold text-orange-900">Operating Hours</h4>
        <p className="mb-2 text-sm opacity-70">Mon, Wed, Fri: 11am – 4pm</p>
        <p className="text-sm opacity-70">Call: 0545761374</p>
        <div className="mt-8 flex gap-4 text-stitch-primary">
          <MaterialIcon
            name="social_leaderboard"
            className="cursor-pointer transition-transform hover:scale-110"
          />
          <MaterialIcon name="movie" className="cursor-pointer transition-transform hover:scale-110" />
          <MaterialIcon
            name="alternate_email"
            className="cursor-pointer transition-transform hover:scale-110"
          />
        </div>
      </div>
      <div className="col-span-full pt-12 text-center text-xs font-medium opacity-50">
        © {new Date().getFullYear()} {SITE_NAME}. Traditional Taste, Quality & Satisfaction.
      </div>
    </footer>
  );
}
