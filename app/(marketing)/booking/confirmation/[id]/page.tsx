import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = { params: { id: string } };

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Booking confirmed",
    robots: { index: false, follow: false },
  };
}

export default function BookingConfirmationPage({ params }: Props) {
  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-16 text-center sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-brand-heading">
        Thank you
      </h1>
      <p className="text-muted-foreground">
        Reference <span className="font-mono font-medium">{params.id}</span>.
        We will verify your payment and confirm your slot shortly.
      </p>
      <Button asChild className="rounded-xl">
        <Link href="/customer">Go to dashboard</Link>
      </Button>
    </div>
  );
}
