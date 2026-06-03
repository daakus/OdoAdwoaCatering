export const SITE_NAME = "Odo Adwoa Catering Services";
export const SITE_DESCRIPTION =
  "Traditional Taste, Quality & Satisfaction! Order Millet Kenkey, grilled proteins, local bar drinks and book event catering across Ghana. MTN MoMo, Vodafone Cash, and AirtelTigo Money accepted.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const TIMEZONE = "Africa/Accra";

export const VENDOR_PHONE = "233545761374";
export const VENDOR_WHATSAPP = `https://wa.me/${VENDOR_PHONE}`;

/** Operating days and hours */
export const OPERATING_SCHEDULE = {
  days: ["Monday", "Wednesday", "Friday"] as const,
  openTime: "11:00 AM",
  closeTime: "4:00 PM",
  displayString: "Mon, Wed & Fri · 11:00 AM – 4:00 PM",
};
