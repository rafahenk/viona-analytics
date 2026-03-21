CREATE TABLE IF NOT EXISTS public.camera_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    camera_id UUID NOT NULL REFERENCES public.cameras(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, camera_id)
);

ALTER TABLE public.camera_access ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Camera Access SELECT" ON public.camera_access;
CREATE POLICY "Camera Access SELECT" ON public.camera_access
    FOR SELECT TO public
    USING (
        user_id = auth.uid() OR
        camera_id IN (SELECT id FROM public.cameras WHERE organization_id = public.get_auth_user_organization_id())
    );

DROP POLICY IF EXISTS "Camera Access INSERT" ON public.camera_access;
CREATE POLICY "Camera Access INSERT" ON public.camera_access
    FOR INSERT TO public
    WITH CHECK (
        camera_id IN (SELECT id FROM public.cameras WHERE organization_id = public.get_auth_user_organization_id())
    );

DROP POLICY IF EXISTS "Camera Access DELETE" ON public.camera_access;
CREATE POLICY "Camera Access DELETE" ON public.camera_access
    FOR DELETE TO public
    USING (
        camera_id IN (SELECT id FROM public.cameras WHERE organization_id = public.get_auth_user_organization_id())
    );
