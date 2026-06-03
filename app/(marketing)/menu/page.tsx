import type { Metadata } from "next";
import { MenuCatalogView } from "@/components/menu/menu-catalog-view";
import { HomeTopNav } from "@/components/home/home-top-nav";
import { HomeFooter } from "@/components/home/home-footer";

export const metadata: Metadata = {
  title: "Menu — Odo Adwoa Catering Services",
  description:
    "Browse our full menu: Millet Kenkey packages, grilled proteins, local bar drinks and more. Order online and pay via MoMo.",
};

export default function MenuPage() {
  return (
    <div className="min-h-dvh bg-stitch-surface">
      <HomeTopNav />
      <MenuCatalogView />
      <HomeFooter />
    </div>
  );
}
