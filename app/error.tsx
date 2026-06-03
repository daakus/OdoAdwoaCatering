"use client";

import { useEffect } from "react";
import { ErrorBoundaryFallback } from "@/components/error-boundary";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-brand-bg px-4 py-16">
      <ErrorBoundaryFallback error={error} reset={reset} />
    </div>
  );
}
