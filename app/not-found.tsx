import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-stitch-surface px-4 text-center">
      <h1 className="font-display text-4xl text-orange-900">404</h1>
      <p className="max-w-md text-muted-foreground">
        This page could not be found. Return to Odo Adwoa Catering to continue your
        journey.
      </p>
      <Button asChild>
        <Link href="/">Back home</Link>
      </Button>
    </div>
  );
}
