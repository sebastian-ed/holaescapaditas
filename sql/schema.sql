-- Ejecutar en Supabase SQL Editor
create extension if not exists pgcrypto;

create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nombre text not null,
  destino text not null,
  categoria text default 'General',
  precio numeric(12,2) not null default 0,
  moneda text not null default 'ARS' check (moneda in ('ARS','USD')),
  noches integer not null default 1,
  badge text,
  descripcion_corta text not null,
  descripcion_larga text,
  incluye text,
  image_urls text,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

DROP TRIGGER IF EXISTS trg_packages_updated_at ON public.packages;
create trigger trg_packages_updated_at
before update on public.packages
for each row execute function public.set_updated_at();

create table if not exists public.site_config (
  id integer primary key,
  whatsapp text,
  mensaje_wa text,
  email text,
  telefono text,
  instagram text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

DROP TRIGGER IF EXISTS trg_site_config_updated_at ON public.site_config;
create trigger trg_site_config_updated_at
before update on public.site_config
for each row execute function public.set_updated_at();

insert into public.site_config (id, whatsapp, mensaje_wa, email, telefono, instagram)
values (1, '5491100000000', 'Hola! Quiero consultar por un paquete.', 'hola@escapaditas.com', '+54 11 0000-0000', 'https://www.instagram.com/hola.escapaditas/')
on conflict (id) do nothing;

create or replace view public.packages_public as
select * from public.packages where activo = true;

alter table public.packages enable row level security;
alter table public.site_config enable row level security;

-- Lectura pública del sitio
DROP POLICY IF EXISTS "public can read active packages" ON public.packages;
create policy "public can read active packages"
on public.packages
for select
to anon, authenticated
using (activo = true);

DROP POLICY IF EXISTS "public can read site config" ON public.site_config;
create policy "public can read site config"
on public.site_config
for select
to anon, authenticated
using (true);

-- Gestión sólo para usuarios autenticados
DROP POLICY IF EXISTS "authenticated can manage packages" ON public.packages;
create policy "authenticated can manage packages"
on public.packages
for all
to authenticated
using (true)
with check (true);

DROP POLICY IF EXISTS "authenticated can manage site config" ON public.site_config;
create policy "authenticated can manage site config"
on public.site_config
for all
to authenticated
using (true)
with check (true);

-- Seed inicial
insert into public.packages (slug, nombre, destino, categoria, precio, moneda, noches, badge, descripcion_corta, descripcion_larga, incluye, image_urls, activo)
values
('bariloche-magico', 'Bariloche Mágico', 'Patagonia, Argentina', 'Nacional', 280000, 'ARS', 5, '', 'Lagos cristalinos, bosques de araucarias y nieve en invierno.', 'Sumérgete en el paisaje más espectacular del sur argentino. Hotel, desayuno y traslados incluidos.', 'Vuelos ida y vuelta, Hotel 4 estrellas, Desayuno diario, Traslados aeropuerto, Seguro de viaje', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85
https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=85', true),
('cancun-todo-incluido', 'Cancún Todo Incluido', 'Quintana Roo, México', 'Internacional', 1850, 'USD', 7, 'Más vendido', 'Playas de arena blanca y mar turquesa. El Caribe al alcance de tu mano.', 'Resort 5 estrellas frente al mar con comidas, bebidas y entretenimiento incluidos.', 'Vuelo internacional, Resort 5 estrellas, Traslados aeropuerto, Seguro de viaje, Asistencia 24h', 'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=1200&q=85
https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1200&q=85', true)
on conflict (slug) do nothing;
