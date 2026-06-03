import type { Metadata } from "next";
import { HomePageView } from "@/components/home/home-page";
import { SITE_NAME } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: "Traditional Taste, Quality & Satisfaction",
  description: `${SITE_NAME} — Millet Kenkey, grilled proteins, local bar drinks, and full event catering in Ghana. Order online and pay via MoMo.`,
  openGraph: {
    title: `${SITE_NAME} | Traditional Taste, Quality & Satisfaction`,
    description:
      "Ghana's favourite Millet Kenkey, grilled proteins, local bar drinks, and full event catering. Order online, pay via MoMo.",
  },
};

export default function HomePage() {
  return <HomePageView />;
}
