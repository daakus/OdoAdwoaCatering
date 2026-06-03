-- Seed one super admin and one admin profile mapping.
-- NOTE:
-- 1) Create these users first in Supabase Auth (Dashboard > Authentication > Users),
--    or update the emails below to existing auth.users emails.
-- 2) This script assigns role_id in public.profiles based on email.

DO $$
DECLARE
  super_admin_role_id uuid;
  admin_role_id uuid;
  super_admin_user_id uuid;
  admin_user_id uuid;
BEGIN
  SELECT id INTO super_admin_role_id FROM public.roles WHERE slug = 'super_admin' LIMIT 1;
  SELECT id INTO admin_role_id FROM public.roles WHERE slug = 'admin' LIMIT 1;

  IF super_admin_role_id IS NULL THEN
    RAISE EXCEPTION 'Role slug "super_admin" not found. Run super-admin compatibility migration first.';
  END IF;

  IF admin_role_id IS NULL THEN
    RAISE EXCEPTION 'Role slug "admin" not found.';
  END IF;

  SELECT id INTO super_admin_user_id
  FROM auth.users
  WHERE email = 'superadmin@odoadwoacatering.com'
  LIMIT 1;

  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'admin@odoadwoacatering.com'
  LIMIT 1;

  IF super_admin_user_id IS NULL THEN
    RAISE NOTICE 'Auth user not found for superadmin@odoadwoacatering.com. Create it first in Authentication > Users.';
  ELSE
    INSERT INTO public.profiles (id, full_name, role_id)
    VALUES (super_admin_user_id, 'Super Admin', super_admin_role_id)
    ON CONFLICT (id) DO UPDATE
      SET role_id = EXCLUDED.role_id,
          full_name = COALESCE(NULLIF(public.profiles.full_name, ''), EXCLUDED.full_name),
          updated_at = now();
  END IF;

  IF admin_user_id IS NULL THEN
    RAISE NOTICE 'Auth user not found for admin@odoadwoacatering.com. Create it first in Authentication > Users.';
  ELSE
    INSERT INTO public.profiles (id, full_name, role_id)
    VALUES (admin_user_id, 'Admin', admin_role_id)
    ON CONFLICT (id) DO UPDATE
      SET role_id = EXCLUDED.role_id,
          full_name = COALESCE(NULLIF(public.profiles.full_name, ''), EXCLUDED.full_name),
          updated_at = now();
  END IF;
END $$;
