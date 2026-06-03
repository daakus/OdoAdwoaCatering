-- Booking runtime configuration tables.

CREATE TABLE IF NOT EXISTS public.blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.business_settings (
  id BOOLEAN PRIMARY KEY DEFAULT true,
  opening_time TIME NOT NULL DEFAULT '09:00',
  closing_time TIME NOT NULL DEFAULT '20:00',
  slot_interval_minutes INT NOT NULL DEFAULT 30 CHECK (slot_interval_minutes > 0),
  max_days_ahead INT NOT NULL DEFAULT 60 CHECK (max_days_ahead > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT business_settings_singleton CHECK (id = true)
);

CREATE TABLE IF NOT EXISTS public.tax_settings (
  id BOOLEAN PRIMARY KEY DEFAULT true,
  tax_rate NUMERIC(6, 4) NOT NULL DEFAULT 0.00 CHECK (tax_rate >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT tax_settings_singleton CHECK (id = true)
);

INSERT INTO public.business_settings (id) VALUES (true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.tax_settings (id) VALUES (true) ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY blocked_dates_read ON public.blocked_dates FOR SELECT USING (true);
CREATE POLICY blocked_dates_admin_write ON public.blocked_dates
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY business_settings_read ON public.business_settings FOR SELECT USING (true);
CREATE POLICY business_settings_admin_write ON public.business_settings
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY tax_settings_read ON public.tax_settings FOR SELECT USING (true);
CREATE POLICY tax_settings_admin_write ON public.tax_settings
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

