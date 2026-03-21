ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT;

-- Garantir acesso para os administradores lerem os perfis da própria organização
DROP POLICY IF EXISTS "Profiles SELECT" ON public.profiles;
CREATE POLICY "Profiles SELECT" ON public.profiles
  FOR SELECT USING (
    id = auth.uid() OR 
    organization_id = public.get_auth_user_organization_id() OR 
    public.is_super_admin()
  );
