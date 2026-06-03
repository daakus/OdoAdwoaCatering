"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export interface ErrorBoundaryFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorBoundaryFallback({
  error,
  reset,
}: ErrorBoundaryFallbackProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="font-display text-2xl text-brand-heading">
        Something went wrong
      </h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Please try again. If the problem continues, contact Odo Adwoa Catering support.
      </p>
      <Button type="button" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
