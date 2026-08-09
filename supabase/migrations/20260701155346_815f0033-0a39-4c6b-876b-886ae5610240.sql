
-- Fix mutable search_path on functions
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = '';
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = '';
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = '';
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = '';

-- Revoke EXECUTE from anon/authenticated on SECURITY DEFINER functions (leave service_role/postgres)
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.email_queue_wake() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.email_queue_dispatch() FROM PUBLIC, anon, authenticated;

-- Replace permissive RLS policies on click_events with validated inserts
DROP POLICY IF EXISTS "Authenticated can insert click events" ON public.click_events;
DROP POLICY IF EXISTS "Anon can insert click events" ON public.click_events;

CREATE POLICY "Anon can insert click events"
  ON public.click_events
  FOR INSERT
  TO anon
  WITH CHECK (
    event_name IS NOT NULL
    AND length(event_name) BETWEEN 1 AND 100
  );

CREATE POLICY "Authenticated can insert click events"
  ON public.click_events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    event_name IS NOT NULL
    AND length(event_name) BETWEEN 1 AND 100
  );
