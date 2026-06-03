"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AdminPageHeader(props: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  const { eyebrow, title, description, actions } = props;
  return (
    <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2rem] text-stitch-secondary">{eyebrow}</p>
        <h1 className="font-display text-4xl tracking-tight text-stitch-on-background">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-stitch-on-surface-variant">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </header>
  );
}

export function AdminStatusBadge(props: { status: string }) {
  const status = props.status.toLowerCase();
  return (
    <span
      className={cn(
        "rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
        status.includes("verified") || status.includes("confirmed")
          ? "bg-green-100 text-green-800"
          : status.includes("rejected") || status.includes("cancel")
            ? "bg-red-100 text-red-800"
            : "bg-stitch-primary-fixed text-stitch-on-primary-fixed-variant"
      )}
    >
      {props.status}
    </span>
  );
}

export function AdminEmptyState(props: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-stitch-outline-variant bg-stitch-surface-container-low p-10 text-center">
      <h3 className="font-display text-xl text-stitch-on-surface">{props.title}</h3>
      <p className="mt-2 text-sm text-stitch-on-surface-variant">{props.description}</p>
    </div>
  );
}

