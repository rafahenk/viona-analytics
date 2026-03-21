DO $$
DECLARE
  new_user_id uuid;
  new_org_id uuid;
  new_cam_id uuid;
  analytic_id_val uuid;
  seed_email text;
  seed_emails text[] := ARRAY['rafahenk@hotmail.com', 'rafael@hnkltech.com'];
BEGIN
  FOREACH seed_email IN ARRAY seed_emails
  LOOP
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = seed_email) THEN
      new_user_id := gen_random_uuid();
      
      INSERT INTO auth.users (
        id, instance_id, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
        is_super_admin, role, aud,
        confirmation_token, recovery_token, email_change_token_new,
        email_change, email_change_token_current,
        phone, phone_change, phone_change_token, reauthentication_token
      ) VALUES (
        new_user_id,
        '00000000-0000-0000-0000-000000000000',
        seed_email,
        crypt('J@ckjoy0308', gen_salt('bf')),
        NOW(), NOW(), NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{"name": "Rafael"}',
        false, 'authenticated', 'authenticated',
        '', '', '', '', '',
        NULL, '', '', ''
      );

      new_org_id := gen_random_uuid();
      
      INSERT INTO public.organizations (id, name, cnpj, status)
      VALUES (new_org_id, 'Empresa Teste', '00.000.000/0001-00', 'trial')
      ON CONFLICT DO NOTHING;

      INSERT INTO public.profiles (id, organization_id, full_name, role)
      VALUES (new_user_id, new_org_id, 'Rafael', 'admin')
      ON CONFLICT (id) DO NOTHING;

      new_cam_id := gen_random_uuid();
      
      INSERT INTO public.cameras (id, organization_id, name, status, connection_url)
      VALUES (new_cam_id, new_org_id, 'Câmera Principal (Exemplo)', 'online', 'rtsp://demo')
      ON CONFLICT DO NOTHING;

      SELECT id INTO analytic_id_val FROM public.analytics_catalog LIMIT 1;
      
      IF analytic_id_val IS NOT NULL THEN
        INSERT INTO public.camera_analytics_config (camera_id, analytic_id)
        VALUES (new_cam_id, analytic_id_val)
        ON CONFLICT DO NOTHING;

        INSERT INTO public.usage_logs (organization_id, camera_id, analytic_id, amount)
        VALUES (new_org_id, new_cam_id, analytic_id_val, 5.5)
        ON CONFLICT DO NOTHING;

        INSERT INTO public.events (camera_id, analytic_id, thumbnail_url)
        VALUES (new_cam_id, analytic_id_val, 'https://img.usecurling.com/p/300/200?q=car')
        ON CONFLICT DO NOTHING;
      END IF;
    END IF;
  END LOOP;
END $$;
