-- Ejecutar una sola vez en Supabase > SQL Editor.
-- Agrega metadatos para el nombre de la clase semanal y un enlace externo opcional.
alter table public.trabajos
  add column if not exists nombre_clase text,
  add column if not exists enlace_url text;

comment on column public.trabajos.nombre_clase is
  'Nombre de la clase correspondiente a la semana del trabajo';
comment on column public.trabajos.enlace_url is
  'Enlace externo opcional asociado al trabajo';
