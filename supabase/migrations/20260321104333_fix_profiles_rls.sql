-- Fix infinite recursion in RLS policies by using SECURITY DEFINER functions

CREATE OR REPLACE FUNCTION public.get_auth_user_organization_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- Drop all existing policies that might cause recursion
DROP POLICY IF EXISTS "Profiles SELECT" ON public.profiles;
DROP POLICY IF EXISTS "Profiles INSERT" ON public.profiles;
DROP POLICY IF EXISTS "Profiles UPDATE" ON public.profiles;
DROP POLICY IF EXISTS "Profiles DELETE" ON public.profiles;

DROP POLICY IF EXISTS "Organizations SELECT" ON public.organizations;
DROP POLICY IF EXISTS "Organizations INSERT" ON public.organizations;
DROP POLICY IF EXISTS "Organizations UPDATE" ON public.organizations;

DROP POLICY IF EXISTS "Cameras SELECT" ON public.cameras;
DROP POLICY IF EXISTS "Cameras INSERT" ON public.cameras;
DROP POLICY IF EXISTS "Cameras UPDATE" ON public.cameras;
DROP POLICY IF EXISTS "Cameras DELETE" ON public.cameras;

DROP POLICY IF EXISTS "CameraAnalyticsConfig SELECT" ON public.camera_analytics_config;
DROP POLICY IF EXISTS "CameraAnalyticsConfig INSERT" ON public.camera_analytics_config;
DROP POLICY IF EXISTS "CameraAnalyticsConfig UPDATE" ON public.camera_analytics_config;
DROP POLICY IF EXISTS "CameraAnalyticsConfig DELETE" ON public.camera_analytics_config;

DROP POLICY IF EXISTS "Events SELECT" ON public.events;
DROP POLICY IF EXISTS "Events INSERT" ON public.events;
DROP POLICY IF EXISTS "Events UPDATE" ON public.events;
DROP POLICY IF EXISTS "Events DELETE" ON public.events;

DROP POLICY IF EXISTS "UsageLogs SELECT" ON public.usage_logs;
DROP POLICY IF EXISTS "UsageLogs INSERT" ON public.usage_logs;
DROP POLICY IF EXISTS "UsageLogs UPDATE" ON public.usage_logs;
DROP POLICY IF EXISTS "UsageLogs DELETE" ON public.usage_logs;

-- Recreate Profiles policies
CREATE POLICY "Profiles SELECT" ON public.profiles FOR SELECT 
USING (
  id = auth.uid() OR 
  organization_id = public.get_auth_user_organization_id()
);

CREATE POLICY "Profiles INSERT" ON public.profiles FOR INSERT 
WITH CHECK (
  id = auth.uid() OR 
  (organization_id = public.get_auth_user_organization_id() AND public.is_admin())
);

CREATE POLICY "Profiles UPDATE" ON public.profiles FOR UPDATE 
USING (
  id = auth.uid() OR 
  (organization_id = public.get_auth_user_organization_id() AND public.is_admin())
);

CREATE POLICY "Profiles DELETE" ON public.profiles FOR DELETE 
USING (
  organization_id = public.get_auth_user_organization_id() AND public.is_admin()
);

-- Recreate Organizations policies
CREATE POLICY "Organizations SELECT" ON public.organizations FOR SELECT 
USING (id = public.get_auth_user_organization_id());

CREATE POLICY "Organizations INSERT" ON public.organizations FOR INSERT 
WITH CHECK (true); -- Allow creation during signup

CREATE POLICY "Organizations UPDATE" ON public.organizations FOR UPDATE 
USING (id = public.get_auth_user_organization_id() AND public.is_admin());

-- Recreate Cameras policies
CREATE POLICY "Cameras SELECT" ON public.cameras FOR SELECT USING (organization_id = public.get_auth_user_organization_id());
CREATE POLICY "Cameras INSERT" ON public.cameras FOR INSERT WITH CHECK (organization_id = public.get_auth_user_organization_id());
CREATE POLICY "Cameras UPDATE" ON public.cameras FOR UPDATE USING (organization_id = public.get_auth_user_organization_id());
CREATE POLICY "Cameras DELETE" ON public.cameras FOR DELETE USING (organization_id = public.get_auth_user_organization_id());

-- Recreate CameraAnalyticsConfig policies
CREATE POLICY "CameraAnalyticsConfig SELECT" ON public.camera_analytics_config FOR SELECT USING (
  camera_id IN (SELECT id FROM public.cameras WHERE organization_id = public.get_auth_user_organization_id())
);
CREATE POLICY "CameraAnalyticsConfig INSERT" ON public.camera_analytics_config FOR INSERT WITH CHECK (
  camera_id IN (SELECT id FROM public.cameras WHERE organization_id = public.get_auth_user_organization_id())
);
CREATE POLICY "CameraAnalyticsConfig UPDATE" ON public.camera_analytics_config FOR UPDATE USING (
  camera_id IN (SELECT id FROM public.cameras WHERE organization_id = public.get_auth_user_organization_id())
);
CREATE POLICY "CameraAnalyticsConfig DELETE" ON public.camera_analytics_config FOR DELETE USING (
  camera_id IN (SELECT id FROM public.cameras WHERE organization_id = public.get_auth_user_organization_id())
);

-- Recreate Events policies
CREATE POLICY "Events SELECT" ON public.events FOR SELECT USING (camera_id IN (SELECT id FROM public.cameras WHERE organization_id = public.get_auth_user_organization_id()));
CREATE POLICY "Events INSERT" ON public.events FOR INSERT WITH CHECK (camera_id IN (SELECT id FROM public.cameras WHERE organization_id = public.get_auth_user_organization_id()));
CREATE POLICY "Events UPDATE" ON public.events FOR UPDATE USING (camera_id IN (SELECT id FROM public.cameras WHERE organization_id = public.get_auth_user_organization_id()));
CREATE POLICY "Events DELETE" ON public.events FOR DELETE USING (camera_id IN (SELECT id FROM public.cameras WHERE organization_id = public.get_auth_user_organization_id()));

-- Recreate UsageLogs policies
CREATE POLICY "UsageLogs SELECT" ON public.usage_logs FOR SELECT USING (organization_id = public.get_auth_user_organization_id());
CREATE POLICY "UsageLogs INSERT" ON public.usage_logs FOR INSERT WITH CHECK (organization_id = public.get_auth_user_organization_id());
CREATE POLICY "UsageLogs UPDATE" ON public.usage_logs FOR UPDATE USING (organization_id = public.get_auth_user_organization_id());
CREATE POLICY "UsageLogs DELETE" ON public.usage_logs FOR DELETE USING (organization_id = public.get_auth_user_organization_id());
