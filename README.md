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

1. Run `supabase/schema.sql` — all tables, security rules, admin access and file storage.
   It's safe to re-run any time (it only adds what's missing).
2. Create your user (Authentication → Users → Add user), then run the
   `insert into public.admins …` statement at the end of `schema.sql` with your email.
3. Add all your content in `/admin`. There is no sample data.

## Editing content (`/admin`)

| Tab | What it controls |
|---|---|
| Profile | Name, initials, headline, intro, email, phone, social links, availability badge, resume |
| About | Bio, About image, location, stats, education (degree line) |
| Projects | Cards: summary, features, tags, demo/GitHub/case-study links, thumbnail, published |
| Experience | Timeline: role, company, dates, location, bullets, tags |
| Skills | Grouped chips (category + Simple Icons slug) |
| Site text | Every label on the site, SEO title/description, show/hide sections |
| Messages | Contact form submissions |

Saving refreshes the public page immediately (`updateTag`); otherwise content refreshes every minute.

## Project structure

```
app/
  page.tsx                 home page — loads content, composes sections
  layout.tsx               fonts + SEO metadata (from Supabase)
  icon.tsx                 favicon generated from your initials
  actions.ts               server actions: contact form, cache refresh
  admin/page.tsx           /admin
components/
  layout/                  Navbar, Footer, SkipLink
  sections/
    hero/                  Hero, HeroArt
    about/                 About, AboutCard, StatList
    projects/              Projects, ProjectCard, ProjectThumbnail, ProjectLinks
    experience/            Experience, ExperienceItem
    skills/                Skills, SkillGroup
    contact/               Contact, ContactDetails, ContactForm
  ui/                      Section, SectionHeading, Monogram, Reveal, TagList,
                           BrandIcon, SocialLinks
  admin/
    AdminApp.tsx           session gate (login / no access / dashboard)
    Dashboard.tsx          sidebar tabs + editors
    LoginForm.tsx, AdminContext.tsx
    layout/AdminShell.tsx  admin header
    editors/               ProfileEditor, AboutEditor, TableEditor,
                           SiteTextEditor, MessagesView
    form/                  RecordForm, FieldInput, UploadInput,
                           upload.ts (checks + storage), values.ts
    config/                fields.ts (what each tab edits), tabs.ts
    ui/                    Panel, IconButton, ErrorBox, EmptyState, Subsection, styles
lib/
  content.ts               cached loader, validates every URL/email/phone
  siteText.ts              all UI labels (editable in Admin → Site text)
  fallback.ts              empty content if Supabase is unreachable (no sample data)
  supabase.ts, types.ts
supabase/
  schema.sql               the whole database: tables, security, storage
```

There is no personal or sample data in the code — everything shown on the site comes from Supabase.

## Deploying (Vercel)

- Framework preset: **Next.js**
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Supabase → Authentication → URL Configuration → Site URL = your Vercel URL
