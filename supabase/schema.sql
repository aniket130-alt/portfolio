-- =============================================================
-- Portfolio content schema for Supabase
-- Run once in: Supabase Dashboard → SQL Editor → New query → Run
-- Then edit your content in: Table Editor
-- =============================================================

-- ---------- Profile (single row) ----------
create table if not exists public.profile (
  id             int primary key default 1 check (id = 1),  -- enforces one row
  name           text not null,
  initials       text not null,
  role           text not null,
  intro          text,
  location       text,
  email          text,
  linkedin_url   text,
  status_badge   text,          -- e.g. "Open to full-time roles"; null hides it
  photo_url      text,          -- public URL from the "portfolio" storage bucket
  cv_url         text,          -- public URL to your CV PDF
  reply_note     text default 'I usually reply within 24 hours.'
);

-- ---------- Experience ----------
create table if not exists public.experience (
  id          bigint generated always as identity primary key,
  role        text not null,
  company     text not null,
  period      text not null,     -- e.g. "2024 — Present"
  summary     text,
  sort_order  int not null default 0
);

-- ---------- Skills ----------
create table if not exists public.skills (
  id          bigint generated always as identity primary key,
  name        text not null,
  level       int  not null check (level between 0 and 100),
  sort_order  int  not null default 0
);

-- ---------- Education ----------
create table if not exists public.education (
  id          bigint generated always as identity primary key,
  label       text not null,     -- "B.Tech, Computer Science" / "University name" / "AWS Certified ..."
  year        text,              -- shown as "label · year" when set
  is_degree   boolean not null default false,  -- true = bold headline line
  sort_order  int not null default 0
);

-- ---------- Projects ----------
create table if not exists public.projects (
  id           bigint generated always as identity primary key,
  title        text not null,
  description  text,
  image_url    text,
  link_url     text,
  published    boolean not null default true,  -- untick to hide without deleting
  sort_order   int not null default 0
);

-- ---------- Row Level Security: public read-only ----------
-- The site uses the public (anon/publishable) key, so it can only READ.
-- You edit content through the Supabase dashboard, which bypasses RLS.
alter table public.profile    enable row level security;
alter table public.experience enable row level security;
alter table public.skills     enable row level security;
alter table public.education  enable row level security;
alter table public.projects   enable row level security;

drop policy if exists "public read" on public.profile;
drop policy if exists "public read" on public.experience;
drop policy if exists "public read" on public.skills;
drop policy if exists "public read" on public.education;
drop policy if exists "public read" on public.projects;

create policy "public read" on public.profile    for select to anon, authenticated using (true);
create policy "public read" on public.experience for select to anon, authenticated using (true);
create policy "public read" on public.skills     for select to anon, authenticated using (true);
create policy "public read" on public.education  for select to anon, authenticated using (true);
create policy "public read" on public.projects   for select to anon, authenticated using (published);

-- ---------- Storage bucket for photo, project images and CV ----------
-- Public bucket: files are readable via their public URL; only you can upload (dashboard).
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- ---------- Starter content (edit in Table Editor afterwards) ----------
insert into public.profile (id, name, initials, role, intro, location, email, linkedin_url, status_badge)
values (
  1, 'Your Name', 'YN', 'Software Engineer',
  '2–3 lines: years of experience, your specialty, and the impact you bring to a team.',
  'City, Country', 'hello@yourname.com', 'https://linkedin.com/in/yourname',
  'Open to full-time roles'
)
on conflict (id) do nothing;

insert into public.experience (role, company, period, summary, sort_order)
select * from (values
  ('Job title',               'Company', '2024 — Present', 'One line on what you owned and a result you are proud of.', 1),
  ('Job title',               'Company', '2022 — 2024',    'One line on what you owned and a result you are proud of.', 2),
  ('Internship / Job title',  'Company', '2021 — 2022',    'One line on what you owned and a result you are proud of.', 3)
) v where not exists (select 1 from public.experience);

insert into public.skills (name, level, sort_order)
select * from (values
  ('Skill one', 90, 1), ('Skill two', 85, 2), ('Skill three', 80, 3),
  ('Skill four', 70, 4), ('Skill five', 65, 5)
) v where not exists (select 1 from public.skills);

insert into public.education (label, year, is_degree, sort_order)
select * from (values
  ('Degree, Major', null::text, true,  1),
  ('University',    'Year',     false, 2),
  ('Certification', 'Year',     false, 3)
) v where not exists (select 1 from public.education);

insert into public.projects (title, description, link_url, sort_order)
select * from (values
  ('Project one',   'What it is, the tools you used and the outcome.', '#', 1),
  ('Project two',   'What it is, the tools you used and the outcome.', '#', 2),
  ('Project three', 'What it is, the tools you used and the outcome.', '#', 3)
) v where not exists (select 1 from public.projects);
