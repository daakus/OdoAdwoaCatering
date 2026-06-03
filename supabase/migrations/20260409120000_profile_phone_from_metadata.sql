-- Persist phone from auth user metadata into profiles on signup
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
  INSERT INTO public.profiles (id, full_name, phone, role_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NULLIF(trim(NEW.raw_user_meta_data->>'phone'), ''),
    customer_role
  );
  RETURN NEW;
END;
$$;
