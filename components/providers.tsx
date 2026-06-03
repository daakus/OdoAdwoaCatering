"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        richColors
        closeButton
        position="top-center"
        toastOptions={{
          classNames: {
            toast: "rounded-xl border-border shadow-soft font-sans",
          },
        }}
      />
    </>
  );
}
