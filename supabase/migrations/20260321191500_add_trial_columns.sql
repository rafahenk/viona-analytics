DO $$
BEGIN
  ALTER TABLE public.analytics_catalog 
    ADD COLUMN IF NOT EXISTS trial_duration_days INT DEFAULT 7,
    ADD COLUMN IF NOT EXISTS trial_event_limit INT DEFAULT 100;

  ALTER TABLE public.camera_analytics_config 
    ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS trial_event_limit INT,
    ADD COLUMN IF NOT EXISTS trial_events_used INT DEFAULT 0;

  ALTER TABLE public.cameras 
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
END $$;
