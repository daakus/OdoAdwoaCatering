export interface DemoBookingService {
  id: string;
  title: string;
  description: string;
  durationMins: number;
  priceGhs: number;
  icon: string;
}

export const DEMO_BOOKING_SERVICES: DemoBookingService[] = [
  {
    id: "signature-facial",
    title: "Signature Radiance Facial",
    description: "60 mins • Deep hydration and gemstone massage.",
    durationMins: 60,
    priceGhs: 120,
    icon: "spa",
  },
  {
    id: "artisan-style",
    title: "Artisan Sculpt & Style",
    description: "45 mins • Precision cut and editorial blowout.",
    durationMins: 45,
    priceGhs: 85,
    icon: "content_cut",
  },
];

export interface DemoStaffOption {
  id: string;
  label: string;
}

export const DEMO_STAFF_OPTIONS: DemoStaffOption[] = [
  { id: "anya", label: "Anya Taylor (Master Stylist)" },
  { id: "marcus", label: "Marcus Reed (Aesthetician)" },
  { id: "elena", label: "Elena Rose (Nail Artist)" },
];

export const DEMO_TIME_SLOTS = [
  "09:00 AM",
  "11:30 AM",
  "02:00 PM",
  "04:30 PM",
] as const;

export const BOOKING_TAX_RATE = 0.05;
