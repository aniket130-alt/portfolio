# Aniket Jindal — Portfolio

Personal portfolio built from `Aniket_Jindal_Portfolio_Website_Structure.pdf`.
All content is managed in Supabase and edited from the built-in admin page — nothing is hardcoded.

## Stack

- **Next.js 16** (App Router, Cache Components) + **React 19** + **TypeScript**
- **Tailwind CSS 4** — design tokens in `app/globals.css`
- **Supabase** — content tables, auth for the admin page, storage for images/resume
- **Lucide** + **Simple Icons** for icons
- Deployed on **Vercel**

## Run locally

```bash
npm install
# create .env.local with:
# NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable or anon key>
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin

## Supabase setup (once)

Run these in **Supabase → SQL Editor**, in order:

1. `supabase/schema.sql` — base tables + public read access + storage bucket
2. `supabase/admin.sql` — admin-only write access; then add your user to `public.admins`
3. `supabase/v2.sql` — v2 columns, `stats`, `site_text`, `contact_messages`
4. `supabase/v2_seed.sql` — optional starter content

## Editing content (`/admin`)

| Tab | What it controls |
|---|---|
| Profile | Name, headline, intro, bio, location, email, social links, availability badge, resume, photo |
| Projects | Cards: summary, features, tags, demo/GitHub/case-study links, thumbnail, published |
| Experience | Timeline: role, company, dates, location, bullets, tags |
| Skills | Grouped chips (category + Simple Icons slug) |
| Stats | The numbers in About |
| Education | Degree line in the About card |
| Site text | Every label on the site, SEO title/description, show/hide sections |
| Messages | Contact form submissions |

Saving refreshes the public page immediately (`updateTag`); otherwise content is cached for an hour.

## Project structure

```
app/
  page.tsx            home page (reads Supabase via lib/content.ts)
  admin/page.tsx      admin page
  actions.ts          contact form + cache refresh (server actions)
  layout.tsx          fonts, metadata
components/           Navbar, Hero, About, Projects, Experience, Skills, Contact, Footer
components/admin/     admin UI (config-driven: fields.ts)
lib/
  content.ts          cached data loader with per-section fallback
  siteText.ts         all UI labels + defaults
  fallback.ts         draft content used if Supabase is unreachable
supabase/             SQL for schema, admin access, v2 and seed
```

## Deploying (Vercel)

- Framework preset: **Next.js**
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Supabase → Authentication → URL Configuration → Site URL = your Vercel URL
