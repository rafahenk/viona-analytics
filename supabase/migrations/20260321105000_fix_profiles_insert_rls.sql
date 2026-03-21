-- Corrige a política RLS de inserção na tabela profiles para permitir a criação do perfil
-- durante o fluxo de registro (signup), momento em que a sessão pode ainda não estar totalmente estabelecida
-- ou o usuário ser considerado anônimo caso a confirmação de e-mail esteja ativada.

DROP POLICY IF EXISTS "Profiles INSERT" ON public.profiles;

CREATE POLICY "Profiles INSERT" ON public.profiles 
FOR INSERT WITH CHECK (true);
