-- Add is_super_admin to profiles for platform-wide administration
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT false;

-- Create function to securely check if current user is a super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT is_super_admin FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- Update Policies to grant super admins full visibility
DROP POLICY IF EXISTS "Organizations SELECT" ON public.organizations;
CREATE POLICY "Organizations SELECT" ON public.organizations
  FOR SELECT USING ( id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()) OR is_super_admin() );

DROP POLICY IF EXISTS "Organizations UPDATE" ON public.organizations;
CREATE POLICY "Organizations UPDATE" ON public.organizations
  FOR UPDATE USING ( (id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid() AND role = 'admin')) OR is_super_admin() );

DROP POLICY IF EXISTS "Profiles SELECT" ON public.profiles;
CREATE POLICY "Profiles SELECT" ON public.profiles
  FOR SELECT USING ( (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()) OR id = auth.uid()) OR is_super_admin() );

DROP POLICY IF EXISTS "Profiles UPDATE" ON public.profiles;
CREATE POLICY "Profiles UPDATE" ON public.profiles
  FOR UPDATE USING ( (id = auth.uid() OR organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid() AND role = 'admin')) OR is_super_admin() );

-- Create Plans Table
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL DEFAULT 0,
    features JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Associate Organizations with a Plan
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL;

-- Create Audit Logs Table for tracking administrative changes
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Plans RLS (Readable by everyone, manageable by super admin)
DROP POLICY IF EXISTS "Plans SELECT" ON public.plans;
CREATE POLICY "Plans SELECT" ON public.plans FOR SELECT USING (true);

DROP POLICY IF EXISTS "Plans ALL Admin" ON public.plans;
CREATE POLICY "Plans ALL Admin" ON public.plans FOR ALL USING (is_super_admin());

-- Audit Logs RLS (Insertable by authenticated, Readable by super admin)
DROP POLICY IF EXISTS "AuditLogs INSERT" ON public.audit_logs;
CREATE POLICY "AuditLogs INSERT" ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "AuditLogs SELECT Admin" ON public.audit_logs;
CREATE POLICY "AuditLogs SELECT Admin" ON public.audit_logs FOR SELECT USING (is_super_admin());

-- Seed Default Plans
INSERT INTO public.plans (id, name, description, price, features) VALUES
('11111111-1111-1111-1111-111111111111'::uuid, 'Plano Básico', 'Ideal para pequenos negócios. Até 5 câmeras.', 99.90, '{"max_cameras": 5}'),
('22222222-2222-2222-2222-222222222222'::uuid, 'Plano Profissional', 'Para médias empresas. Até 20 câmeras.', 299.90, '{"max_cameras": 20}'),
('33333333-3333-3333-3333-333333333333'::uuid, 'Plano Corporativo', 'Monitoramento em larga escala. Câmeras ilimitadas.', 999.90, '{"max_cameras": -1}')
ON CONFLICT (id) DO NOTHING;

-- Assign basic plan to existing organizations
UPDATE public.organizations SET plan_id = '11111111-1111-1111-1111-111111111111'::uuid WHERE plan_id IS NULL;

-- Elevate all existing admins to super admin (Ensuring access for current users testing the platform)
UPDATE public.profiles SET is_super_admin = true WHERE role = 'admin';

-- Explicitly seed rafahenk@hotmail.com as super admin
DO $$
DECLARE
  new_org_id UUID;
  new_user_id UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'rafahenk@hotmail.com') THEN
    new_org_id := gen_random_uuid();
    new_user_id := gen_random_uuid();

    INSERT INTO public.organizations (id, name, cnpj, billing_email, status, plan_id)
    VALUES (new_org_id, 'Viona Admin Corp', '00.000.000/0001-00', 'rafahenk@hotmail.com', 'active', '33333333-3333-3333-3333-333333333333'::uuid)
    ON CONFLICT DO NOTHING;

    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_user_id, '00000000-0000-0000-0000-000000000000', 'rafahenk@hotmail.com', crypt('securepassword123', gen_salt('bf')), NOW(),
      NOW(), NOW(), '{"provider": "email", "providers": ["email"]}', '{"name": "Rafael Admin"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );

    INSERT INTO public.profiles (id, organization_id, full_name, role, is_super_admin)
    VALUES (new_user_id, new_org_id, 'Rafael Admin', 'admin', true)
    ON CONFLICT DO NOTHING;
  ELSE
    -- If user exists, guarantee super admin privileges
    UPDATE public.profiles SET is_super_admin = true WHERE id = (SELECT id FROM auth.users WHERE email = 'rafahenk@hotmail.com');
  END IF;
END $$;
