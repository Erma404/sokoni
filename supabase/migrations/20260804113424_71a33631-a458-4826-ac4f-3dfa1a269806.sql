
-- ROLES
create type public.app_role as enum ('admin','buyer');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  company text,
  country text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile write" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, company, country)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'company', new.raw_user_meta_data ->> 'country')
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'buyer') on conflict do nothing;
  return new;
end; $$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- PRODUCTS
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  variety text not null default 'Hass',
  caliber text not null,
  packaging text not null,
  net_weight_kg numeric not null,
  price_per_kg_eur numeric not null,
  price_per_carton_eur numeric not null,
  moq_cartons integer not null default 1,
  certifications text[] not null default '{}',
  description text,
  image_url text,
  season text,
  created_at timestamptz not null default now()
);
grant select on public.products to anon, authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "products public read" on public.products for select to anon, authenticated using (true);
create policy "products admin write" on public.products for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- ORDERS
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  tracking_code text not null unique,
  buyer_id uuid references auth.users(id) on delete set null,
  buyer_company text,
  product_summary text not null,
  quantity_cartons integer not null default 1,
  quantity_kg numeric,
  incoterm text not null default 'DAP',
  origin_farm text,
  destination text not null default 'Rungis, Paris',
  status text not null default 'processing',
  forwarder_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;
create policy "buyer reads own orders" on public.orders for select to authenticated
  using (auth.uid() = buyer_id or public.has_role(auth.uid(),'admin'));

-- TRACKING EVENTS (publicly readable: shareable tracking links)
create table public.tracking_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  checkpoint text not null,
  stage_index integer not null default 0,
  status text not null default 'completed',
  location text,
  occurred_at timestamptz not null default now(),
  notes text,
  reference text,
  temperature_c numeric,
  document_url text,
  document_label text,
  created_at timestamptz not null default now()
);
create index tracking_events_order_idx on public.tracking_events(order_id, stage_index);
grant select on public.tracking_events to anon, authenticated;
grant all on public.tracking_events to service_role;
alter table public.tracking_events enable row level security;
create policy "tracking events public read" on public.tracking_events for select to anon, authenticated using (true);

-- RFQ
create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid references auth.users(id) on delete set null,
  contact_name text not null,
  company text not null,
  email text not null,
  country text,
  incoterm text,
  message text,
  items jsonb not null default '[]'::jsonb,
  status text not null default 'new',
  created_at timestamptz not null default now()
);
grant insert on public.quote_requests to anon, authenticated;
grant select on public.quote_requests to authenticated;
grant all on public.quote_requests to service_role;
alter table public.quote_requests enable row level security;
create policy "anyone can request a quote" on public.quote_requests for insert to anon, authenticated with check (true);
create policy "admin reads quotes" on public.quote_requests for select to authenticated using (public.has_role(auth.uid(),'admin'));

-- public order lookup by tracking code (no login required)
create or replace function public.get_order_by_code(_code text)
returns table (
  id uuid, tracking_code text, buyer_company text, product_summary text,
  quantity_cartons integer, quantity_kg numeric, incoterm text,
  origin_farm text, destination text, status text, created_at timestamptz
) language sql stable security definer set search_path = public as $$
  select o.id, o.tracking_code, o.buyer_company, o.product_summary,
         o.quantity_cartons, o.quantity_kg, o.incoterm,
         o.origin_farm, o.destination, o.status, o.created_at
  from public.orders o
  where upper(o.tracking_code) = upper(trim(_code))
$$;
grant execute on function public.get_order_by_code(text) to anon, authenticated;

alter publication supabase_realtime add table public.tracking_events;
alter publication supabase_realtime add table public.orders;

-- SEED PRODUCTS
insert into public.products (slug,name,caliber,packaging,net_weight_kg,price_per_kg_eur,price_per_carton_eur,moq_cartons,certifications,description,season) values
('hass-14-16-10kg','Hass Avocado — Caliber 14/16','14/16','10 kg crate',10,3.20,32.00,120,'{GlobalGAP,"EU Organic"}','Large-caliber Hass from the Kenyan highlands, harvested at 24% dry matter. Field-packed and pre-cooled within six hours.','Mar – Sep'),
('hass-18-20-10kg','Hass Avocado — Caliber 18/20','18/20','10 kg crate',10,3.05,30.50,120,'{GlobalGAP}','The Rungis workhorse caliber. Consistent count per crate, uniform ripening curve.','Mar – Oct'),
('hass-22-24-10kg','Hass Avocado — Caliber 22/24','22/24','10 kg crate',10,2.85,28.50,100,'{GlobalGAP,"EU Organic"}','Mid-caliber fruit for retail punnets and food service.','Apr – Oct'),
('hass-26-28-4kg','Hass Avocado — Caliber 26/28','26/28','4 kg crate',4,3.40,13.60,200,'{GlobalGAP}','Smaller caliber in a 4 kg crate for high-rotation market stalls.','Apr – Nov'),
('hass-premium-2kg','Hass Avocado — Premium Select','16/18','2 kg premium pack',2,4.60,9.20,150,'{GlobalGAP,"EU Organic","Fair for Life"}','Hand-graded single-farm selection, individually stickered, presentation carton.','Jun – Sep'),
('hass-sample-kit','Hass Sample Kit','Mixed','Sample kit',3,0.00,45.00,1,'{GlobalGAP}','Three calibers plus full documentation pack, shipped airfreight for buyer evaluation.','Year round');
