"use client";

import Link from "next/link";
import { useState } from "react";
import {
  MENU_ITEMS,
  MENU_CATEGORY_TABS,
  type MenuCategorySlug,
} from "@/lib/constants/menu-catalog";
import { useCartStore } from "@/stores/cart-store";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { cn } from "@/lib/utils";

export function MenuCatalogView() {
  const [activeCategory, setActiveCategory] = useState<MenuCategorySlug>("all");
  const { itemCount, subtotal } = useCartStore();
  const count = itemCount();

  const visible =
    activeCategory === "all"
      ? MENU_ITEMS
      : MENU_ITEMS.filter((i) => i.category === activeCategory);

  return (
    <div className="min-h-screen bg-stitch-surface pb-32 pt-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="mb-2 text-center">
          <span className="font-label text-[10px] font-semibold uppercase tracking-[0.3em] text-stitch-secondary">
            Order Online
          </span>
          <h1 className="mt-2 font-display text-4xl text-orange-900 md:text-5xl">Our Menu</h1>
          <p className="mt-3 text-sm text-stitch-on-surface-variant">
            Traditional Taste, Quality &amp; Satisfaction!
          </p>
        </div>

        {/* Category tabs */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {MENU_CATEGORY_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveCategory(tab.value)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors",
                activeCategory === tab.value
                  ? "bg-stitch-primary text-stitch-on-primary"
                  : "bg-stitch-surface-container-low text-stitch-on-surface-variant hover:bg-stitch-surface-container"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Sticky cart footer */}
      {count > 0 ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-stitch-outline-variant/20 bg-stitch-surface/95 px-4 py-3 shadow-nav-up backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <span className="text-sm font-semibold">
              {count} item{count !== 1 ? "s" : ""} · GH₵ {subtotal().toFixed(2)}
            </span>
            <Link
              href="/order"
              className="rounded-full bg-stitch-primary px-8 py-3 text-sm font-bold text-stitch-on-primary transition-opacity hover:opacity-90"
            >
              Checkout →
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
