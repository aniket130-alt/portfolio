-- =============================================================
-- Portfolio database — complete schema
-- Supabase Dashboard → SQL Editor → New query → paste → Run
--
-- Safe to run on a new OR existing project, as many times as you like:
-- it only creates what's missing and never deletes your content.
-- Optional starter content is in seed.sql.
-- =============================================================


-- ============ 1. Admin access ============
-- Only users listed here can edit content or upload files.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.admins enable row level security;
-- (no policies: the table is invisible through the API)

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


-- ============ 2. Content tables ============

-- Profile: a single row (id = 1)
create table if not exists public.profile (
  id           int primary key default 1 check (id = 1),
  name         text not null,
  initials     text not null,
  role         text not null
);
alter table public.profile add column if not exists headline      text;
alter table public.profile add column if not exists intro         text;
alter table public.profile add column if not exists about         text;
alter table public.profile add column if not exists location      text;
alter table public.profile add column if not exists email         text;
alter table public.profile add column if not exists phone         text;
alter table public.profile add column if not exists linkedin_url  text;
alter table public.profile add column if not exists github_url    text;
alter table public.profile add column if not exists instagram_url text;
alter table public.profile add column if not exists x_url         text;
alter table public.profile add column if not exists status_badge  text;
alter table public.profile add column if not exists available     boolean not null default true;
alter table public.profile add column if not exists photo_url     text;
alter table public.profile add column if not exists cv_url        text;
alter table public.profile add column if not exists reply_note    text;
alter table public.profile drop constraint if exists profile_phone_check;
alter table public.profile add constraint profile_phone_check
  check (phone is null or phone ~ '^\+?[0-9 ()\-]{6,20}$');

create table if not exists public.stats (
  id          bigint generated always as identity primary key,
  value       text not null,
  label       text not null,
  icon        text,                               -- code | briefcase | graduation-cap | star
  sort_order  int  not null default 0
);

create table if not exists public.skills (
  id          bigint generated always as identity primary key,
  name        text not null,
  sort_order  int  not null default 0
);
alter table public.skills add column if not exists category text not null default 'Other';
alter table public.skills add column if not exists icon     text;   -- simple-icons slug
-- v1 had a required "level" (%) column; it's unused now
do $$ begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'skills' and column_name = 'level') then
    alter table public.skills alter column level drop not null;
  end if;
end $$;

create table if not exists public.projects (
  id           bigint generated always as identity primary key,
  title        text not null,
  description  text,
  image_url    text,
  published    boolean not null default true,
  sort_order   int not null default 0
);
alter table public.projects add column if not exists slug           text;
alter table public.projects add column if not exists features       text[] not null default '{}';
alter table public.projects add column if not exists tags           text[] not null default '{}';
alter table public.projects add column if not exists demo_url       text;
alter table public.projects add column if not exists github_url     text;
alter table public.projects add column if not exists case_study_url text;
alter table public.projects add column if not exists extra_url      text;  -- custom link (Play Store, Figma, video…)
alter table public.projects add column if not exists extra_label    text;  -- its button text

create table if not exists public.experience (
  id          bigint generated always as identity primary key,
  role        text not null,
  company     text not null,
  period      text not null,
  summary     text,
  sort_order  int  not null default 0
);
alter table public.experience add column if not exists location text;
alter table public.experience add column if not exists bullets  text[] not null default '{}';
alter table public.experience add column if not exists tags     text[] not null default '{}';

create table if not exists public.education (
  id          bigint generated always as identity primary key,
  label       text not null,
  year        text,
  is_degree   boolean not null default false,
  sort_order  int not null default 0
);

-- Every UI label on the site (key → value), edited in Admin → Site text
create table if not exists public.site_text (
  key    text primary key,
  value  text
);

-- Contact form submissions
create table if not exists public.contact_messages (
  id          bigint generated always as identity primary key,
  name        text not null check (char_length(name) between 1 and 100),
  email       text not null check (char_length(email) between 3 and 200),
  message     text not null check (char_length(message) between 1 and 5000),
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);


-- ============ 3. Row Level Security ============
-- Visitors: read content only. Admins: everything. Messages: visitors can only send.
do $$
declare t text;
begin
  foreach t in array array['profile','stats','skills','projects','experience','education','site_text'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('drop policy if exists "admin write" on public.%I', t);
    execute format('create policy "admin write" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant insert, update, delete on public.%I to authenticated', t);
    if t <> 'projects' then
      execute format('create policy "public read" on public.%I for select to anon, authenticated using (true)', t);
    end if;
  end loop;
end $$;
-- Unpublished projects stay hidden from visitors (admins see all via "admin write")
create policy "public read" on public.projects for select to anon, authenticated using (published);

alter table public.contact_messages enable row level security;
drop policy if exists "anyone can send" on public.contact_messages;
drop policy if exists "admin manage"    on public.contact_messages;
create policy "anyone can send" on public.contact_messages
  for insert to anon, authenticated with check (is_read = false);
create policy "admin manage" on public.contact_messages
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
grant insert on public.contact_messages to anon, authenticated;
grant select, update, delete on public.contact_messages to authenticated;


-- ============ 4. File storage (photo, project images, resume) ============
-- Public read by URL; max 5 MB; images + PDF only (no SVG — it can contain scripts).
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

update storage.buckets
set public             = true,
    file_size_limit    = 5242880,
    allowed_mime_types = array['image/png','image/jpeg','image/webp','image/gif','image/avif','application/pdf']
where id = 'portfolio';

drop policy if exists "portfolio admin all"   on storage.objects;
drop policy if exists "portfolio admin write" on storage.objects;
create policy "portfolio admin write" on storage.objects
  for all to authenticated
  using (bucket_id = 'portfolio' and public.is_admin())
  with check (
    bucket_id = 'portfolio'
    and public.is_admin()
    and (storage.foldername(name))[1] in ('about', 'profile', 'projects', 'resume')
  );


-- ============ 5. Make yourself an admin ============
-- 1) Authentication → Users → Add user (tick "Auto Confirm User")
-- 2) Put your email below, then run just this statement:
--
-- insert into public.admins (user_id)
-- select id from auth.users where lower(email) = lower('you@example.com')
-- on conflict do nothing;
