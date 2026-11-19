-- =============================================================
-- Portfolio v2 schema (run AFTER schema.sql and admin.sql)
-- Supabase Dashboard → SQL Editor → New query → paste → Run
-- Safe to run more than once. Adds columns/tables; deletes nothing.
-- =============================================================

-- ---------- profile: new fields ----------
alter table public.profile add column if not exists headline      text;
alter table public.profile add column if not exists about         text;
alter table public.profile add column if not exists github_url    text;
alter table public.profile add column if not exists instagram_url text;
alter table public.profile add column if not exists x_url         text;
alter table public.profile add column if not exists available     boolean not null default true;

-- ---------- skills: grouped chips instead of % bars ----------
alter table public.skills add column if not exists category text not null default 'Other';
alter table public.skills add column if not exists icon     text;   -- simple-icons slug, e.g. 'react'
alter table public.skills alter column level drop not null;

-- ---------- projects: richer cards ----------
alter table public.projects add column if not exists slug           text;
alter table public.projects add column if not exists features       text[] not null default '{}';
alter table public.projects add column if not exists tags           text[] not null default '{}';
alter table public.projects add column if not exists demo_url       text;
alter table public.projects add column if not exists github_url     text;
alter table public.projects add column if not exists case_study_url text;

-- ---------- experience: bullets, tags, location ----------
alter table public.experience add column if not exists location text;
alter table public.experience add column if not exists bullets  text[] not null default '{}';
alter table public.experience add column if not exists tags     text[] not null default '{}';

-- ---------- stats (About section) ----------
create table if not exists public.stats (
  id          bigint generated always as identity primary key,
  value       text not null,             -- "10+"
  label       text not null,             -- "Projects"
  icon        text,                      -- code | briefcase | graduation-cap | star
  sort_order  int  not null default 0
);

-- ---------- site_text: every UI label on the site (key → value) ----------
create table if not exists public.site_text (
  key    text primary key,
  value  text
);

-- ---------- contact form messages ----------
create table if not exists public.contact_messages (
  id          bigint generated always as identity primary key,
  name        text not null check (char_length(name) between 1 and 100),
  email       text not null check (char_length(email) between 3 and 200),
  message     text not null check (char_length(message) between 1 and 5000),
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ---------- Row Level Security ----------
alter table public.stats            enable row level security;
alter table public.site_text        enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "public read"  on public.stats;
drop policy if exists "admin write"  on public.stats;
drop policy if exists "public read"  on public.site_text;
drop policy if exists "admin write"  on public.site_text;
drop policy if exists "anyone can send" on public.contact_messages;
drop policy if exists "admin manage"    on public.contact_messages;

create policy "public read" on public.stats     for select to anon, authenticated using (true);
create policy "public read" on public.site_text for select to anon, authenticated using (true);
create policy "admin write" on public.stats     for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin write" on public.site_text for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Visitors may only INSERT messages (never read them). Admins read/update/delete.
create policy "anyone can send" on public.contact_messages
  for insert to anon, authenticated with check (is_read = false);
create policy "admin manage" on public.contact_messages
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Explicit grants (Data API access for the new tables)
grant select on public.stats, public.site_text to anon, authenticated;
grant insert, update, delete on public.stats, public.site_text to authenticated;
grant insert on public.contact_messages to anon, authenticated;
grant select, update, delete on public.contact_messages to authenticated;
