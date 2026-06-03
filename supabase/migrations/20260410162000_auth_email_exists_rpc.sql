-- Expose a safe boolean check for account existence by email.
-- Returns only true/false; does not expose user records.

CREATE OR REPLACE FUNCTION public.auth_email_exists(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users u
    WHERE lower(u.email) = lower(trim(p_email))
  );
$$;

GRANT EXECUTE ON FUNCTION public.auth_email_exists(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.auth_email_exists(TEXT) TO authenticated;

