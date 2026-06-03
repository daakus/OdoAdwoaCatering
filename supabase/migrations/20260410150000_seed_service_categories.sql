-- Ensure service_categories supports production category metadata
-- and seed default Odo Adwoa catering menu categories.

ALTER TABLE public.service_categories
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

INSERT INTO public.service_categories (name, slug, description, is_active, sort_order)
VALUES
  ('General',               'general',              'Fallback category for uncategorised items.', true, 0),
  ('Kenkey Packages',       'kenkey',               'Millet Kenkey packages with sides and condiments.', true, 10),
  ('Proteins & Grills',     'protein',              'Grilled pork, tilapia, chicken, and fried fish.', true, 20),
  ('Sides & Condiments',    'sides',                'Okra stew, shito, gravy, and hot peppers.', true, 30),
  ('Local Bar Drinks',      'drinks',               'Sobolo, Asana, Pito, Lamugin, and bottled water.', true, 40),
  ('Event Catering',        'event-catering',       'Full buffet and drinks packages for events.', true, 50)
ON CONFLICT (slug) DO UPDATE
SET
  name        = EXCLUDED.name,
  description = EXCLUDED.description,
  is_active   = EXCLUDED.is_active,
  sort_order  = EXCLUDED.sort_order;
