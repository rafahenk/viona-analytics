-- Create Tables
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    cnpj TEXT UNIQUE,
    billing_email TEXT,
    status TEXT DEFAULT 'trial' CHECK (status IN ('active', 'trial', 'past_due', 'canceled')),
    trial_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    full_name TEXT,
    role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'operator', 'viewer')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cameras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    connection_url TEXT,
    status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.analytics_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price_model TEXT CHECK (price_model IN ('per_event', 'monthly')),
    unit_price NUMERIC(10,4) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.camera_analytics_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    camera_id UUID NOT NULL REFERENCES public.cameras(id) ON DELETE CASCADE,
    analytic_id UUID NOT NULL REFERENCES public.analytics_catalog(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    activated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(camera_id, analytic_id)
);

CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    camera_id UUID NOT NULL REFERENCES public.cameras(id) ON DELETE CASCADE,
    analytic_id UUID NOT NULL REFERENCES public.analytics_catalog(id) ON DELETE CASCADE,
    metadata JSONB DEFAULT '{}'::jsonb,
    thumbnail_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    camera_id UUID REFERENCES public.cameras(id) ON DELETE SET NULL,
    analytic_id UUID REFERENCES public.analytics_catalog(id) ON DELETE SET NULL,
    amount NUMERIC(10,4) NOT NULL DEFAULT 0,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cameras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.camera_analytics_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Organizations
CREATE POLICY "Organizations SELECT" ON public.organizations FOR SELECT USING (id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Organizations INSERT" ON public.organizations FOR INSERT WITH CHECK (true); -- Allow creation during signup
CREATE POLICY "Organizations UPDATE" ON public.organizations FOR UPDATE USING (id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Profiles
CREATE POLICY "Profiles SELECT" ON public.profiles FOR SELECT USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()) OR id = auth.uid());
CREATE POLICY "Profiles INSERT" ON public.profiles FOR INSERT WITH CHECK (id = auth.uid() OR organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Profiles UPDATE" ON public.profiles FOR UPDATE USING (id = auth.uid() OR organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Profiles DELETE" ON public.profiles FOR DELETE USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Cameras
CREATE POLICY "Cameras SELECT" ON public.cameras FOR SELECT USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Cameras INSERT" ON public.cameras FOR INSERT WITH CHECK (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Cameras UPDATE" ON public.cameras FOR UPDATE USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Cameras DELETE" ON public.cameras FOR DELETE USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

-- Analytics Catalog
CREATE POLICY "Analytics Catalog SELECT" ON public.analytics_catalog FOR SELECT TO authenticated USING (true);

-- Camera Analytics Config
CREATE POLICY "CameraAnalyticsConfig SELECT" ON public.camera_analytics_config FOR SELECT USING (camera_id IN (SELECT id FROM public.cameras WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())));
CREATE POLICY "CameraAnalyticsConfig INSERT" ON public.camera_analytics_config FOR INSERT WITH CHECK (camera_id IN (SELECT id FROM public.cameras WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())));
CREATE POLICY "CameraAnalyticsConfig UPDATE" ON public.camera_analytics_config FOR UPDATE USING (camera_id IN (SELECT id FROM public.cameras WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())));
CREATE POLICY "CameraAnalyticsConfig DELETE" ON public.camera_analytics_config FOR DELETE USING (camera_id IN (SELECT id FROM public.cameras WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())));

-- Events
CREATE POLICY "Events SELECT" ON public.events FOR SELECT USING (camera_id IN (SELECT id FROM public.cameras WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())));
CREATE POLICY "Events INSERT" ON public.events FOR INSERT WITH CHECK (camera_id IN (SELECT id FROM public.cameras WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())));
CREATE POLICY "Events UPDATE" ON public.events FOR UPDATE USING (camera_id IN (SELECT id FROM public.cameras WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())));
CREATE POLICY "Events DELETE" ON public.events FOR DELETE USING (camera_id IN (SELECT id FROM public.cameras WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())));

-- Usage Logs
CREATE POLICY "UsageLogs SELECT" ON public.usage_logs FOR SELECT USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "UsageLogs INSERT" ON public.usage_logs FOR INSERT WITH CHECK (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "UsageLogs UPDATE" ON public.usage_logs FOR UPDATE USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "UsageLogs DELETE" ON public.usage_logs FOR DELETE USING (organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

-- Seed Data (Analytics Catalog)
INSERT INTO public.analytics_catalog (slug, name, description, price_model, unit_price) VALUES
('movimento-inteligente', 'Movimento Inteligente', 'Diferencia pessoas e veículos de ruídos visuais.', 'per_event', 0.01),
('contagem-pessoas', 'Contagem de Pessoas', 'Contagem de entradas/saídas e fluxo por período.', 'per_event', 0.05),
('heatmap', 'Heatmap', 'Identifica áreas de maior tráfego e interesse.', 'monthly', 5.00),
('intrusao', 'Intrusão', 'Alertas imediatos para invasões de áreas restritas.', 'per_event', 0.05),
('linha-virtual', 'Linha Virtual', 'Detecção direcional em linhas virtuais cruzadas.', 'per_event', 0.02),
('lpr', 'LPR (Placas)', 'Leitura e registro automático de placas veiculares.', 'per_event', 0.10),
('permanencia', 'Permanência', 'Identifica pessoas paradas de forma suspeita.', 'per_event', 0.05),
('aglomeracao', 'Aglomeração', 'Contagem simultânea para evitar superlotação.', 'per_event', 0.05),
('objeto-abandonado', 'Objeto Abandonado', 'Identifica itens suspeitos deixados no local.', 'per_event', 0.10),
('remocao-objeto', 'Remoção de Objeto', 'Alerta quando itens valiosos são retirados.', 'per_event', 0.10),
('classificacao-veiculos', 'Classificação de Veículos', 'Diferencia carros, motos, ônibus e caminhões.', 'per_event', 0.05),
('deteccao-epi', 'Detecção de EPI', 'Verifica uso obrigatório de capacetes e coletes.', 'per_event', 0.10)
ON CONFLICT (slug) DO NOTHING;

-- Seed User & Organization
DO $$
DECLARE
    new_org_id UUID := gen_random_uuid();
    new_user_id UUID := gen_random_uuid();
BEGIN
    INSERT INTO public.organizations (id, name, cnpj, billing_email, status)
    VALUES (new_org_id, 'Acme Corp', '12.345.678/0001-90', 'admin@acme.com', 'active')
    ON CONFLICT (cnpj) DO NOTHING;

    INSERT INTO auth.users (
        id, instance_id, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
        is_super_admin, role, aud,
        confirmation_token, recovery_token, email_change_token_new,
        email_change, email_change_token_current,
        phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
        new_user_id, '00000000-0000-0000-0000-000000000000', 'admin@acme.com', crypt('Admin123!', gen_salt('bf')), NOW(),
        NOW(), NOW(), '{"provider": "email", "providers": ["email"]}', '{"name": "Admin Acme"}',
        false, 'authenticated', 'authenticated',
        '', '', '', '', '', NULL, '', '', ''
    );

    INSERT INTO public.profiles (id, organization_id, full_name, role)
    VALUES (new_user_id, new_org_id, 'Admin Acme', 'admin')
    ON CONFLICT DO NOTHING;
END $$;
