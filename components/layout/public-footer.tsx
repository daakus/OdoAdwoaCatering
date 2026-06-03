import Link from "next/link";
import { SITE_NAME } from "@/lib/constants/site";

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
  { href: "/payment-instructions", label: "Payments" },
  { href: "/login", label: "Sign in" },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-brand-border bg-brand-heading text-brand-bg">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <p className="font-display text-2xl font-semibold">{SITE_NAME}</p>
            <p className="mt-2 max-w-sm text-sm text-brand-bg/80">
              Premium beauty and wellness in Ghana. Book online and pay with
              MoMo.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-brand-bg/90 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-1 text-center md:text-left">
          <p className="text-xs text-brand-bg/60">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-brand-bg/40">
            Built by{" "}
            <span className="font-medium text-brand-bg/60">Berndaakus Tech Solutions</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
