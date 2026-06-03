import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: `Terms of Service | ${SITE_NAME}`,
  description: "Terms for using Odo Adwoa Catering Services and this website.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6">
      <h1 className="font-headline text-3xl text-orange-900">Terms of Service</h1>
      <p className="mt-4 text-sm text-stitch-on-surface-variant">
        This is a placeholder. Final terms will cover food orders, event catering bookings,
        cancellations, payments, Mobile Money verification, and use of this platform.
      </p>
      <p className="mt-6 text-sm text-stitch-on-surface-variant">
        See also our{" "}
        <Link href="/privacy" className="text-stitch-primary underline">Privacy Policy</Link>.
      </p>
    </div>
  );
}
