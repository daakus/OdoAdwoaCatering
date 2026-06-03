import { redirect } from "next/navigation";

// Old /booking route — redirect to the event catering page
export default function BookingPage() {
  redirect("/events");
}
