import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: `Work With Us | ${SITE_NAME}`,
  description: "Join the Odo Adwoa Catering Services team in Ghana.",
};

export default function CareersPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6">
      <h1 className="font-headline text-3xl text-orange-900">Work With Us</h1>
      <p className="mt-4 text-sm text-stitch-on-surface-variant">
        We are always looking for passionate individuals who love Ghanaian food and
        great customer service. Cooks, delivery assistants, and event coordinators are welcome.
      </p>
      <p className="mt-6 text-sm text-stitch-on-surface-variant">
        Reach us via{" "}
        <Link href="/contact" className="text-stitch-primary underline">WhatsApp or phone</Link>{" "}
        with a brief introduction.
      </p>
    </div>
  );
}
