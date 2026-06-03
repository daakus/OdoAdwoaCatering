"use client";

import { useCartStore } from "@/stores/cart-store";
import type { MenuItem } from "@/lib/constants/menu-catalog";
import { cn } from "@/lib/utils";

export function MenuItemCard({ item }: { item: MenuItem }) {
  const { lines, addItem, updateQuantity } = useCartStore();
  const line = lines.find((l) => l.item.id === item.id);
  const qty = line?.quantity ?? 0;

  const badgeColor: Record<string, string> = {
    Popular:      "bg-amber-100 text-amber-800",
    "Best Value": "bg-green-100 text-green-800",
    New:          "bg-blue-100 text-blue-800",
  };

  return (
    <div className="flex flex-col rounded-2xl border border-stitch-outline-variant/20 bg-stitch-surface-container-lowest p-4 shadow-card transition-shadow hover:shadow-soft">
      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-stitch-primary-fixed text-4xl">
        {item.emoji}
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-headline text-base font-bold leading-snug text-orange-900">
            {item.title}
          </h3>
          {item.badge ? (
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                badgeColor[item.badge] ?? "bg-stitch-primary-fixed text-stitch-primary"
              )}
            >
              {item.badge}
            </span>
          ) : null}
        </div>
        <p className="line-clamp-2 text-xs leading-relaxed text-stitch-on-surface-variant">
          {item.description}
        </p>
        <p className="mt-1 text-sm font-bold text-stitch-primary">
          GH₵ {item.priceGhs.toFixed(2)}
        </p>
      </div>

      <div className="mt-3">
        {qty === 0 ? (
          <button
            type="button"
            onClick={() => addItem(item)}
            className="w-full rounded-xl bg-stitch-primary py-2 text-sm font-bold text-stitch-on-primary transition-opacity hover:opacity-90"
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, qty - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-stitch-outline-variant text-lg font-bold transition-colors hover:bg-stitch-surface-container"
            >
              −
            </button>
            <span className="min-w-[2rem] text-center text-sm font-bold">{qty}</span>
            <button
              type="button"
              onClick={() => addItem(item)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-stitch-primary text-lg font-bold text-stitch-on-primary transition-opacity hover:opacity-90"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
