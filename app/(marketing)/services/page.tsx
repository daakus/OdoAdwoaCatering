import { redirect } from "next/navigation";

// /services no longer exists — redirect to the catering menu
export default function ServicesPage() {
  redirect("/menu");
}
