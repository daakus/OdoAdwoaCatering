import { SITE_NAME } from "@/lib/constants/site";

export interface MomoMerchantDisplay {
  id: "mtn" | "vodafone" | "airteltigo";
  label: string;
  merchantName: string;
  number: string;
  borderClass: string;
}

/** Display-only merchant lines; override via env for production. */
export const PAYMENT_MERCHANTS: MomoMerchantDisplay[] = [
  {
    id: "mtn",
    label: "MTN MoMo",
    merchantName: SITE_NAME,
    number: process.env.NEXT_PUBLIC_MOMO_MTN_NUMBER ?? "0545761374",
    borderClass: "border-yellow-500",
  },
  {
    id: "vodafone",
    label: "Vodafone Cash",
    merchantName: SITE_NAME,
    number: process.env.NEXT_PUBLIC_MOMO_VODAFONE_NUMBER ?? "020 987 6543",
    borderClass: "border-red-600",
  },
  {
    id: "airteltigo",
    label: "AirtelTigo",
    merchantName: SITE_NAME,
    number: process.env.NEXT_PUBLIC_MOMO_AIRTELTIGO_NUMBER ?? "026 555 1234",
    borderClass: "border-blue-600",
  },
];
