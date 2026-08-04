create table if not exists public.brand_settings (
  id text primary key default 'default',
  pdf_logo_url text,
  updated_at timestamptz not null default now()
);
grant select on public.brand_settings to anon, authenticated;
grant insert, update on public.brand_settings to authenticated;
grant all on public.brand_settings to service_role;
alter table public.brand_settings enable row level security;
create policy "brand settings public read" on public.brand_settings for select to anon, authenticated using (true);
create policy "brand settings admin insert" on public.brand_settings for insert to authenticated with check (has_role(auth.uid(),'admin'));
create policy "brand settings admin update" on public.brand_settings for update to authenticated using (has_role(auth.uid(),'admin')) with check (has_role(auth.uid(),'admin'));
insert into public.brand_settings (id) values ('default') on conflict do nothing;