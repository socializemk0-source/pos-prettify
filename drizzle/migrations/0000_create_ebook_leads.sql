CREATE TABLE public.ebook_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  created_at timestamptz not null default now()
);

GRANT INSERT ON public.ebook_leads TO anon;
GRANT ALL ON public.ebook_leads TO service_role;

ALTER TABLE public.ebook_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can request the ebook"
  ON public.ebook_leads
  FOR INSERT
  TO anon
  WITH CHECK (true);