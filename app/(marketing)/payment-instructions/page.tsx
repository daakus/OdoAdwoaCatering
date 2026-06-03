import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentSanctuaryView } from "@/components/payment/payment-sanctuary-view";
import { SITE_NAME } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: `Payment | ${SITE_NAME}`,
  description: "Pay with MTN MoMo, Vodafone Cash, or AirtelTigo Money.",
};

export default function PaymentInstructionsPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-stitch-background pt-32 text-center">Loading…</div>}>
      <PaymentSanctuaryView />
    </Suspense>
  );
}
