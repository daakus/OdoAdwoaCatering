import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: `Privacy Policy | ${SITE_NAME}`,
  description: "How Odo Adwoa Catering Services handles your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6">
      <h1 className="font-headline text-3xl text-orange-900">Privacy Policy</h1>
      <p className="mt-4 text-sm text-stitch-on-surface-variant">
        This is a placeholder. A full privacy policy will describe what data we collect
        (name, phone, order details, payment screenshots), how we use it, and your rights
        under Ghana&apos;s Data Protection Act.
      </p>
      <p className="mt-6 text-sm text-stitch-on-surface-variant">
        For questions, please{" "}
        <Link href="/contact" className="text-stitch-primary underline">contact us</Link>.
      </p>
    </div>
  );
}
