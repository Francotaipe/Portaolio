-- POLÍTICAS PARA SUBIR, VER Y ELIMINAR TRABAJOS
-- Usa tu misma tabla public.trabajos y el bucket trabajos.

grant select, insert, delete on table public.trabajos to authenticated;
grant select on table public.trabajos to anon;

alter table public.trabajos enable row level security;

drop policy if exists "anon puede ver trabajos" on public.trabajos;
create policy "anon puede ver trabajos"
on public.trabajos
for select
to anon
using (true);

drop policy if exists "authenticated puede ver trabajos" on public.trabajos;
create policy "authenticated puede ver trabajos"
on public.trabajos
for select
to authenticated
using (true);

drop policy if exists "usuarios pueden insertar sus trabajos" on public.trabajos;
create policy "usuarios pueden insertar sus trabajos"
on public.trabajos
for insert
to authenticated
with check (auth.uid() = usuario_id);

drop policy if exists "usuarios pueden eliminar sus trabajos" on public.trabajos;
create policy "usuarios pueden eliminar sus trabajos"
on public.trabajos
for delete
to authenticated
using (auth.uid() = usuario_id);

grant select on storage.objects to anon, authenticated;
grant insert, delete on storage.objects to authenticated;

drop policy if exists "anon puede leer bucket trabajos" on storage.objects;
create policy "anon puede leer bucket trabajos"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'trabajos');

drop policy if exists "usuarios pueden subir sus archivos" on storage.objects;
create policy "usuarios pueden subir sus archivos"
on storage.objects for insert
to authenticated
with check (
  bucket_id='trabajos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "usuarios pueden borrar sus archivos" on storage.objects;
create policy "usuarios pueden borrar sus archivos"
on storage.objects for delete
to authenticated
using (
  bucket_id='trabajos'
  and (storage.foldername(name))[1] = auth.uid()::text
);
