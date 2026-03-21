-- Update is_admin function to consider any non-operator as admin of their org context
-- This ensures standard users (gestores) can perform admin tasks within their organization
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT coalesce(role, '') != 'operator' FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;
