-- =============================================================
-- Portfolio v2 starter content (run AFTER v2.sql)
-- Replaces the old "Your Name / Job title / Skill one" placeholders with the
-- blueprint's DRAFT content. Edit everything afterwards in /admin.
-- It does NOT touch your email, LinkedIn, photo or CV fields.
-- =============================================================

update public.profile set
  name         = 'Aniket Jindal',
  initials     = 'AJ',
  role         = 'Full Stack Developer',
  headline     = 'Full Stack Developer | B.Tech CSE',
  intro        = 'I build modern, scalable and real-time web applications with React, TypeScript, Golang and PostgreSQL.',
  about        = 'I''m a software developer with a foundation in computer science and hands-on experience building web applications. I enjoy solving practical problems, working across frontend and backend systems, and turning ideas into reliable products.',
  location     = 'Delhi, India',
  status_badge = 'Available for opportunities',
  available    = true,
  reply_note   = 'Available for developer roles, collaborations and freelance projects.'
where id = 1;

-- Old placeholder rows from schema.sql
delete from public.skills     where name in ('Skill one','Skill two','Skill three','Skill four','Skill five');
delete from public.experience where company = 'Company';
delete from public.projects   where title in ('Project one','Project two','Project three');
delete from public.education  where label in ('Degree, Major','University','Certification');

insert into public.stats (value, label, icon, sort_order)
select * from (values
  ('10+',       'Projects',   'code',           1),
  ('6+ Months', 'Experience', 'briefcase',      2),
  ('B.Tech',    'CSE',        'graduation-cap', 3)
) v where not exists (select 1 from public.stats);

insert into public.skills (name, category, icon, sort_order)
select * from (values
  ('React',            'Frontend',       'react',         1),
  ('Next.js',          'Frontend',       'nextdotjs',     2),
  ('TypeScript',       'Frontend',       'typescript',    3),
  ('JavaScript',       'Frontend',       'javascript',    4),
  ('Tailwind CSS',     'Frontend',       'tailwindcss',   5),
  ('Golang',           'Backend',        'go',            6),
  ('Node.js',          'Backend',        'nodedotjs',     7),
  ('REST APIs',        'Backend',        null,            8),
  ('PostgreSQL',       'Database',       'postgresql',    9),
  ('Supabase',         'Database',       'supabase',     10),
  ('Git',              'Tools / DevOps', 'git',          11),
  ('GitHub',           'Tools / DevOps', 'github',       12),
  ('Docker',           'Tools / DevOps', 'docker',       13),
  ('Linux',            'Tools / DevOps', 'linux',        14),
  ('Vercel',           'Tools / DevOps', 'vercel',       15),
  ('Python',           'Other',          'python',       16),
  ('Testing',          'Other',          null,           17),
  ('API integration',  'Other',          null,           18),
  ('Geospatial / maps','Other',          'openstreetmap',19)
) v(name, category, icon, sort_order) where not exists (select 1 from public.skills);

insert into public.projects (title, slug, description, features, tags, published, sort_order)
select * from (values
  ('Live Bus Tracker', 'live-bus-tracker',
   'Real-time fleet monitoring with GPS tracking, geofencing and route deviation insights.',
   array['Live GPS tracking','Geofencing alerts','Route deviation insights'],
   array['React','TypeScript','Go','PostgreSQL'], true, 1),
  ('Coffee-Hub', 'coffee-hub',
   'Coffee shop website with product browsing and online ordering flows.',
   array['Product browsing','Ordering flow'],
   array['React','TypeScript','Supabase'], true, 2),
  ('Workforce Platform', 'workforce-platform',
   'Attendance, tasks, leave and expense workflows with role-based access.',
   array['Attendance & leave','Tasks & expenses','Role-based access'],
   array['React','Go','PostgreSQL'], true, 3),
  ('AutoNest', 'autonest',
   'Car marketplace concept for comparing vehicles and connecting buyers with dealers.',
   array['Vehicle comparison','Buyer–dealer connection'],
   array['Next.js','TypeScript'], true, 4)
) v where not exists (select 1 from public.projects);

insert into public.experience (role, company, period, bullets, tags, sort_order)
select * from (values
  ('Software Engineer Intern', 'Aeoru Enterprises Pvt. Ltd.', 'Jan 2026 — Jul 2026',
   array['Built real-time fleet tracking with geofencing.',
         'Worked on location processing for live vehicle positions.',
         'Built dashboards with React and TypeScript on a Golang backend.'],
   array['React','TypeScript','Go','PostgreSQL'], 1),
  ('Web Development Intern', 'Sanskrit e Solutions & Services Pvt. Ltd.', 'Add dates',
   array['Wrote testing scripts.','Contributed to web development and testing.'],
   array['Testing','Web'], 2),
  ('Web Development Intern', 'CodSoft', 'Add dates',
   array['Built mini projects with HTML, CSS and JavaScript.'],
   array['HTML','CSS','JavaScript'], 3)
) v where not exists (select 1 from public.experience);

insert into public.education (label, year, is_degree, sort_order)
select 'B.Tech, Computer Science & Engineering', null, true, 1
where not exists (select 1 from public.education);
