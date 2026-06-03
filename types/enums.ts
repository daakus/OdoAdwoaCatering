export type AppointmentStatus =
  | "pending_payment"
  | "payment_submitted"
  | "payment_verified"
  | "booking_confirmed"
  | "cancelled"
  | "rejected";

export type PaymentMethod =
  | "mtn_momo"
  | "vodafone_cash"
  | "airteltigo_money";

export type PaymentVerificationStatus =
  | "pending"
  | "submitted"
  | "verified"
  | "rejected";

export type RoleSlug = "customer" | "staff" | "admin";

export type NotificationChannel = "in_app" | "email" | "sms" | "whatsapp";
