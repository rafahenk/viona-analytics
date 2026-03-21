-- Fix infinite recursion in RLS policies for profiles and organizations
-- replacing direct subqueries with SECURITY DEFINER functions

DROP POLICY IF EXISTS "Organizations SELECT" ON public.organizations;
CREATE POLICY "Organizations SELECT" ON public.organizations
  FOR SELECT USING (
    id = public.get_auth_user_organization_id() OR 
    public.is_super_admin()
  );

DROP POLICY IF EXISTS "Organizations UPDATE" ON public.organizations;
CREATE POLICY "Organizations UPDATE" ON public.organizations
  FOR UPDATE USING (
    (id = public.get_auth_user_organization_id() AND public.is_admin()) OR 
    public.is_super_admin()
  );

DROP POLICY IF EXISTS "Profiles SELECT" ON public.profiles;
CREATE POLICY "Profiles SELECT" ON public.profiles
  FOR SELECT USING (
    id = auth.uid() OR 
    organization_id = public.get_auth_user_organization_id() OR 
    public.is_super_admin()
  );

DROP POLICY IF EXISTS "Profiles UPDATE" ON public.profiles;
CREATE POLICY "Profiles UPDATE" ON public.profiles
  FOR UPDATE USING (
    id = auth.uid() OR 
    (organization_id = public.get_auth_user_organization_id() AND public.is_admin()) OR 
    public.is_super_admin()
  );
