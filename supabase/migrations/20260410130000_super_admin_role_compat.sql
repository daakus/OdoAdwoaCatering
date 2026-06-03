-- Add optional super_admin role and make policy helpers compatible.

INSERT INTO public.roles (name, slug, description)
VALUES ('Super Admin', 'super_admin', 'Platform-level administration')
ON CONFLICT (slug) DO NOTHING;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.current_role_slug() IN ('admin', 'super_admin');
$$;

CREATE OR REPLACE FUNCTION public.is_staff_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.current_role_slug() IN ('staff', 'admin', 'super_admin');
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_staff_or_admin() TO authenticated;

