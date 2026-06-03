-- Odo Adwoa Catering Services — initial schema, RLS, storage bucket declarations
-- Run in Supabase SQL editor or via CLI. Storage policies at end.

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------
CREATE TYPE public.appointment_status AS ENUM (
  'pending_payment',
  'payment_submitted',
  'payment_verified',
  'booking_confirmed',
  'cancelled',
  'rejected'
);

CREATE TYPE public.payment_method AS ENUM (
  'mtn_momo',
  'vodafone_cash',
  'airteltigo_money'
);

CREATE TYPE public.payment_verification_status AS ENUM (
  'pending',
  'submitted',
  'verified',
  'rejected'
);

CREATE TYPE public.notification_channel AS ENUM ('in_app', 'email', 'sms', 'whatsapp');

-- -----------------------------------------------------------------------------
-- Roles & profiles (app users extend auth.users)
-- -----------------------------------------------------------------------------
CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.roles (name, slug, description) VALUES
  ('Customer', 'customer', 'Books and manages own appointments'),
  ('Staff', 'staff', 'Therapist / stylist'),
  ('Admin', 'admin', 'Full salon management');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role_id UUID NOT NULL REFERENCES public.roles (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_role_id ON public.profiles (role_id);

-- -----------------------------------------------------------------------------
-- Services
-- -----------------------------------------------------------------------------
CREATE TABLE public.service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.service_categories (id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  duration_minutes INT NOT NULL DEFAULT 60,
  price_ghs NUMERIC(12, 2) NOT NULL,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_services_category ON public.services (category_id);
CREATE INDEX idx_services_active ON public.services (is_active);

-- -----------------------------------------------------------------------------
-- Staff
-- -----------------------------------------------------------------------------
CREATE TABLE public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles (id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.staff_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES public.staff (id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  UNIQUE (staff_id, day_of_week, start_time, end_time)
);

CREATE INDEX idx_staff_availability_staff ON public.staff_availability (staff_id);

-- -----------------------------------------------------------------------------
-- Appointments & line items
-- -----------------------------------------------------------------------------
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  staff_id UUID REFERENCES public.staff (id) ON DELETE SET NULL,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  status public.appointment_status NOT NULL DEFAULT 'pending_payment',
  customer_notes TEXT,
  internal_notes TEXT,
  approved_by UUID REFERENCES public.profiles (id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_appointments_user ON public.appointments (user_id);
CREATE INDEX idx_appointments_staff ON public.appointments (staff_id);
CREATE INDEX idx_appointments_start ON public.appointments (start_at);
CREATE INDEX idx_appointments_status ON public.appointments (status);

CREATE TABLE public.appointment_services (
  appointment_id UUID NOT NULL REFERENCES public.appointments (id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services (id) ON DELETE RESTRICT,
  price_at_booking NUMERIC(12, 2) NOT NULL,
  duration_minutes INT NOT NULL,
  PRIMARY KEY (appointment_id, service_id)
);

-- -----------------------------------------------------------------------------
-- Payments (one row per appointment)
-- -----------------------------------------------------------------------------
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL UNIQUE REFERENCES public.appointments (id) ON DELETE CASCADE,
  method public.payment_method NOT NULL,
  reference TEXT,
  screenshot_path TEXT,
  verification_status public.payment_verification_status NOT NULL DEFAULT 'pending',
  verified_by UUID REFERENCES public.profiles (id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- Favorites, notifications, reviews, gallery, contact, settings
-- -----------------------------------------------------------------------------
CREATE TABLE public.user_favorite_services (
  user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, service_id)
);

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  channel public.notification_channel NOT NULL DEFAULT 'in_app',
  read_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON public.notifications (user_id);

CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES public.appointments (id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (appointment_id)
);

CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  image_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ
);

CREATE TABLE public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- updated_at trigger
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER tr_services_updated BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER tr_staff_updated BEFORE UPDATE ON public.staff
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER tr_appointments_updated BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER tr_payments_updated BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER tr_settings_updated BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- New user → profile with customer role
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  customer_role uuid;
BEGIN
  SELECT id INTO customer_role FROM public.roles WHERE slug = 'customer' LIMIT 1;
  INSERT INTO public.profiles (id, full_name, role_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    customer_role
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- Helper: current profile role slug
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_role_slug()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.slug
  FROM public.profiles p
  JOIN public.roles r ON r.id = p.role_id
  WHERE p.id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.current_role_slug() = 'admin';
$$;

CREATE OR REPLACE FUNCTION public.is_staff_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.current_role_slug() IN ('staff', 'admin');
$$;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorite_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Roles: readable by authenticated users
CREATE POLICY roles_read_authenticated ON public.roles
  FOR SELECT TO authenticated USING (true);

-- Profiles
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT TO authenticated USING (id = auth.uid() OR public.is_staff_or_admin());
CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid())
  WITH CHECK (id = auth.uid());
CREATE POLICY profiles_admin_all ON public.profiles
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Public read for active services / categories / staff / gallery
CREATE POLICY service_categories_public_read ON public.service_categories
  FOR SELECT USING (true);
CREATE POLICY services_public_read ON public.services
  FOR SELECT USING (is_active = true OR public.is_staff_or_admin());
CREATE POLICY services_admin_write ON public.services
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY staff_public_read ON public.staff
  FOR SELECT USING (is_active = true OR public.is_staff_or_admin());
CREATE POLICY staff_admin_write ON public.staff
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY staff_availability_read ON public.staff_availability
  FOR SELECT USING (public.is_staff_or_admin() OR EXISTS (
    SELECT 1 FROM public.staff s WHERE s.id = staff_id AND s.is_active = true
  ));
CREATE POLICY staff_availability_staff_manage ON public.staff_availability
  FOR ALL TO authenticated USING (
    public.is_admin() OR EXISTS (
      SELECT 1 FROM public.staff s WHERE s.id = staff_id AND s.profile_id = auth.uid()
    )
  ) WITH CHECK (
    public.is_admin() OR EXISTS (
      SELECT 1 FROM public.staff s WHERE s.id = staff_id AND s.profile_id = auth.uid()
    )
  );

-- Appointments: customers see own; staff see assigned; admin see all
CREATE POLICY appointments_customer_select ON public.appointments
  FOR SELECT TO authenticated USING (
    user_id = auth.uid() OR public.is_admin() OR EXISTS (
      SELECT 1 FROM public.staff s WHERE s.id = appointments.staff_id AND s.profile_id = auth.uid()
    )
  );
CREATE POLICY appointments_customer_insert ON public.appointments
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY appointments_customer_update ON public.appointments
  FOR UPDATE TO authenticated USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());
CREATE POLICY appointments_admin_delete ON public.appointments
  FOR DELETE TO authenticated USING (public.is_admin());

CREATE POLICY appointment_services_select ON public.appointment_services
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.appointments a
      WHERE a.id = appointment_id AND (
        a.user_id = auth.uid() OR public.is_admin() OR EXISTS (
          SELECT 1 FROM public.staff s WHERE s.id = a.staff_id AND s.profile_id = auth.uid()
        )
      )
    )
  );
CREATE POLICY appointment_services_write ON public.appointment_services
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.appointments a
      WHERE a.id = appointment_id AND (a.user_id = auth.uid() OR public.is_admin())
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.appointments a
      WHERE a.id = appointment_id AND (a.user_id = auth.uid() OR public.is_admin())
    )
  );

-- Payments
CREATE POLICY payments_select ON public.payments
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.appointments a
      WHERE a.id = appointment_id AND (
        a.user_id = auth.uid() OR public.is_admin() OR EXISTS (
          SELECT 1 FROM public.staff s WHERE s.id = a.staff_id AND s.profile_id = auth.uid()
        )
      )
    )
  );
CREATE POLICY payments_customer_upsert ON public.payments
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.appointments a WHERE a.id = appointment_id AND a.user_id = auth.uid())
  );
CREATE POLICY payments_customer_update ON public.payments
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.appointments a WHERE a.id = appointment_id AND a.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.appointments a WHERE a.id = appointment_id AND a.user_id = auth.uid())
  );
CREATE POLICY payments_admin_all ON public.payments
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Favorites
CREATE POLICY favorites_own ON public.user_favorite_services
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Notifications
CREATE POLICY notifications_own ON public.notifications
  FOR ALL TO authenticated USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

-- Reviews
CREATE POLICY reviews_select ON public.reviews FOR SELECT USING (true);
CREATE POLICY reviews_insert_own ON public.reviews
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY reviews_admin ON public.reviews
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Gallery
CREATE POLICY gallery_public_read ON public.gallery_images
  FOR SELECT USING (is_published = true OR public.is_staff_or_admin());
CREATE POLICY gallery_admin_write ON public.gallery_images
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Contact messages: anyone can insert (anon), staff/admin read
CREATE POLICY contact_insert_anon ON public.contact_messages
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY contact_insert_auth ON public.contact_messages
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY contact_read_staff ON public.contact_messages
  FOR SELECT TO authenticated USING (public.is_staff_or_admin());

-- Settings: public read keys needed for client (optional tighten per key)
CREATE POLICY settings_read ON public.settings FOR SELECT USING (true);
CREATE POLICY settings_admin_write ON public.settings
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- Storage buckets (create if not exists)
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('payment-screenshots', 'payment-screenshots', false),
  ('service-images', 'service-images', true),
  ('staff-images', 'staff-images', true),
  ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO NOTHING;

-- Payment screenshots: customer uploads to own folder; admin/staff read
CREATE POLICY payment_screenshots_insert ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'payment-screenshots'
    AND split_part(name, '/', 1) = auth.uid()::text
  );
CREATE POLICY payment_screenshots_select ON storage.objects
  FOR SELECT TO authenticated USING (
    bucket_id = 'payment-screenshots'
    AND (
      split_part(name, '/', 1) = auth.uid()::text
      OR public.is_staff_or_admin()
    )
  );

-- Public read buckets
CREATE POLICY service_images_public ON storage.objects
  FOR SELECT USING (bucket_id = 'service-images');
CREATE POLICY service_images_admin ON storage.objects
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY staff_images_public ON storage.objects
  FOR SELECT USING (bucket_id = 'staff-images');
CREATE POLICY staff_images_admin ON storage.objects
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY gallery_images_public ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery-images');
CREATE POLICY gallery_images_admin ON storage.objects
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- RPC grants (layouts / server actions)
-- -----------------------------------------------------------------------------
GRANT EXECUTE ON FUNCTION public.current_role_slug() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_staff_or_admin() TO authenticated;
