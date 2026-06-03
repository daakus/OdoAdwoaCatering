"use client";

import { useRouter } from "next/navigation";
import { EDITORIAL_RADIANCE } from "@/lib/constants/auth-editorial";
import { MaterialIcon } from "@/components/home/material-icon";
import { cn } from "@/lib/utils";

export type AuthHeaderLayout = "inline" | "balanced";

export function AuthTransactionalHeader({
  layout,
  className,
}: {
  layout: AuthHeaderLayout;
  className?: string;
}) {
  const router = useRouter();

  const back = (
    <button
      type="button"
      className="scale-95 text-orange-900 transition-transform duration-300 hover:opacity-70 dark:text-orange-200"
      aria-label="Go back"
      onClick={() => router.back()}
    >
      <MaterialIcon name="arrow_back" className="text-2xl" />
    </button>
  );

  const title = (
    <span className="font-headline text-2xl italic text-orange-900 dark:text-orange-100">
      {EDITORIAL_RADIANCE}
    </span>
  );

  if (layout === "balanced") {
    return (
      <header
        className={cn(
          "fixed top-0 z-50 w-full bg-stone-50/80 backdrop-blur-md dark:bg-stone-950/80",
          className
        )}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          {back}
          <span className="font-headline text-2xl tracking-tighter italic text-orange-900">
            {EDITORIAL_RADIANCE}
          </span>
          <div className="w-10" aria-hidden />
        </div>
      </header>
    );
  }

  return (
    <header
      className={cn(
        "fixed top-0 z-50 flex w-full items-center bg-stone-50/80 px-6 py-4 backdrop-blur-md dark:bg-stone-950/80",
        className
      )}
    >
      <div className="flex items-center gap-4">
        {back}
        {title}
      </div>
    </header>
  );
}
