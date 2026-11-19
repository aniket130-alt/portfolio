-- =============================================================
-- Harden the "portfolio" storage bucket (run once, after admin.sql)
-- Supabase Dashboard → SQL Editor → New query → paste → Run
-- =============================================================

-- 1. Server-side limits: max 5 MB per file, images + PDF only.
--    Storage rejects anything else before it is saved, whoever uploads it.
--    SVG is deliberately excluded: SVG files can contain scripts.
update storage.buckets
set
  public             = true,           -- files are readable by URL (needed to show them on the site)
  file_size_limit    = 5242880,        -- 5 MB
  allowed_mime_types = array[
    'image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif',
    'application/pdf'
  ]
where id = 'portfolio';

-- 2. Writes: admins only, and only into the folders the admin page uses.
drop policy if exists "portfolio admin all" on storage.objects;
drop policy if exists "portfolio admin write" on storage.objects;
create policy "portfolio admin write" on storage.objects
  for all to authenticated
  using (bucket_id = 'portfolio' and public.is_admin())
  with check (
    bucket_id = 'portfolio'
    and public.is_admin()
    and (storage.foldername(name))[1] in ('about', 'profile', 'projects', 'resume')
  );

-- Visitors get files through the public URL only; there is no policy that lets
-- them list, upload, overwrite or delete objects.

-- Check the result:
select id, public, file_size_limit, allowed_mime_types from storage.buckets where id = 'portfolio';
