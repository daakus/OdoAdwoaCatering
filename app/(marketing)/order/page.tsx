import type { Metadata } from "next";
import { OrderCheckoutView } from "@/components/orders/order-checkout-view";

export const metadata: Metadata = {
  title: "Checkout — Odo Adwoa Catering Services",
  description: "Complete your food order and pay via MTN MoMo or Vodafone Cash.",
};

export default function OrderPage() {
  return <OrderCheckoutView />;
}
