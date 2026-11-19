-- =============================================================
-- Admin access for the portfolio (run AFTER schema.sql)
-- Supabase Dashboard → SQL Editor → New query → Run
-- =============================================================

-- Who is allowed to edit. Only rows in this table get write access.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.admins enable row level security;
-- No policies on purpose: the table can't be read or changed through the API.

-- True when the signed-in user is in public.admins.
-- SECURITY DEFINER lets it read admins despite RLS; search_path is pinned for safety.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;
revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- Write access to content tables (admins only) ----------
drop policy if exists "admin write" on public.profile;
drop policy if exists "admin write" on public.experience;
drop policy if exists "admin write" on public.skills;
drop policy if exists "admin write" on public.education;
drop policy if exists "admin write" on public.projects;

create policy "admin write" on public.profile    for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin write" on public.experience for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin write" on public.skills     for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin write" on public.education  for all to authenticated using (public.is_admin()) with check (public.is_admin());
-- Also lets admins see unpublished projects.
create policy "admin write" on public.projects   for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Uploads to the "portfolio" storage bucket (admins only) ----------
drop policy if exists "portfolio admin all" on storage.objects;
create policy "portfolio admin all" on storage.objects
  for all to authenticated
  using (bucket_id = 'portfolio' and public.is_admin())
  with check (bucket_id = 'portfolio' and public.is_admin());

-- ---------- Make yourself an admin ----------
-- 1. Create your user first: Authentication → Users → Add user → Create new user
--    (tick "Auto Confirm User").
-- 2. Then replace the email below and run just this statement:
--
-- insert into public.admins (user_id)
-- select id from auth.users where email = 'you@example.com'
-- on conflict do nothing;
