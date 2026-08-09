CREATE TABLE public.click_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name text NOT NULL,
    event_data jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.click_events TO anon;
GRANT INSERT ON public.click_events TO authenticated;
GRANT ALL ON public.click_events TO service_role;

ALTER TABLE public.click_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can insert click events"
ON public.click_events
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Authenticated can insert click events"
ON public.click_events
FOR INSERT
TO authenticated
WITH CHECK (true);