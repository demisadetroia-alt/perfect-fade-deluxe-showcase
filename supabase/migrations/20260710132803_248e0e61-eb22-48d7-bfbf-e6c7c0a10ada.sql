
-- Bookings: replace overly-permissive read policy
DROP POLICY IF EXISTS "read all bookings" ON public.bookings;

CREATE POLICY "read own bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "admin read all bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Lock down SECURITY DEFINER functions.
-- Trigger functions must not be callable via the API.
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.auto_grant_admin() FROM PUBLIC, anon, authenticated;

-- has_role is used inside RLS policies (evaluated as the querying role),
-- so authenticated must still execute it. Revoke from anon/public.
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
