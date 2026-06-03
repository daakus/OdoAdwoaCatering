import type {
  AppointmentStatus,
  NotificationChannel,
  PaymentMethod,
  PaymentVerificationStatus,
} from "./enums";

export interface Role {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileWithRole extends Profile {
  role?: Role;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
}

export interface Service {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  duration_minutes: number;
  price_ghs: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Staff {
  id: string;
  profile_id: string;
  display_name: string;
  title: string | null;
  bio: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StaffAvailability {
  id: string;
  staff_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface Appointment {
  id: string;
  user_id: string;
  staff_id: string | null;
  start_at: string;
  end_at: string;
  status: AppointmentStatus;
  customer_notes: string | null;
  internal_notes: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AppointmentServiceRow {
  appointment_id: string;
  service_id: string;
  price_at_booking: string;
  duration_minutes: number;
}

export interface Payment {
  id: string;
  appointment_id: string;
  method: PaymentMethod;
  reference: string | null;
  screenshot_path: string | null;
  verification_status: PaymentVerificationStatus;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserFavoriteService {
  user_id: string;
  service_id: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  channel: NotificationChannel;
  read_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Review {
  id: string;
  appointment_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  title: string | null;
  image_url: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  created_at: string;
  read_at: string | null;
}

export interface Setting {
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
}

export interface AppointmentWithRelations extends Appointment {
  services?: Service[];
  payment?: Payment | null;
  staff?: Staff | null;
}
