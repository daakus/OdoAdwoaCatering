"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicNavbar } from "@/components/layout/public-navbar";

export function MarketingChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isStitchShell =
    pathname === "/" ||
    pathname === "/services" ||
    pathname.startsWith("/services/") ||
    pathname === "/booking" ||
    pathname === "/payment-instructions";

  if (isStitchShell) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-brand-bg">
      <PublicNavbar />
      <div className="flex-1">{children}</div>
      <PublicFooter />
    </div>
  );
}
