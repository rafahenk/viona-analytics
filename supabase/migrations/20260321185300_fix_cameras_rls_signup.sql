-- Drop the existing restricted policy that blocks anonymous inserts
DROP POLICY IF EXISTS "Cameras INSERT" ON public.cameras;

-- Create a new policy to allow camera creation during registration.
-- This is necessary because email confirmation prevents immediate authentication,
-- making the client insert the initial organization, profile, and camera as an anonymous user.
CREATE POLICY "Cameras INSERT" ON public.cameras
  FOR INSERT WITH CHECK (true);
