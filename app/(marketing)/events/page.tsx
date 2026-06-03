import type { Metadata } from "next";
import { EventBookingView } from "@/components/events/event-booking-view";

export const metadata: Metadata = {
  title: "Event Catering — Odo Adwoa Catering Services",
  description:
    "Book full-scale catering for weddings, funerals, parties and corporate events. Choose kenkey buffets, grilled protein stations, and local drinks packages.",
};

export default function EventsPage() {
  return <EventBookingView />;
}
