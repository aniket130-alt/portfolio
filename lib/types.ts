// Shapes of the Supabase tables (see supabase/schema.sql).

export type Profile = {
  id: number;
  name: string;
  initials: string;
  role: string;
  headline: string | null;      // "Full Stack Developer | B.Tech CSE"
  intro: string | null;         // hero paragraph
  about: string | null;         // About section bio
  location: string | null;
  email: string | null;
  phone: string | null;         // shown in Contact as a tel: link
  linkedin_url: string | null;
  github_url: string | null;
  instagram_url: string | null;
  x_url: string | null;
  status_badge: string | null;  // "Available for opportunities"
  available: boolean;           // badge only shows when true
  photo_url: string | null;
  cv_url: string | null;        // resume PDF
  reply_note: string | null;
};

export type Stat = { id: number; value: string; label: string; icon: string | null; sort_order: number };

export type Skill = {
  id: number;
  name: string;
  category: string;             // Frontend | Backend | Database | Tools / DevOps | Other
  icon: string | null;          // simple-icons slug, e.g. "react"
  sort_order: number;
};

export type Project = {
  id: number;
  title: string;
  slug: string | null;
  description: string | null;   // one-line value
  features: string[];
  tags: string[];
  image_url: string | null;
  demo_url: string | null;
  github_url: string | null;
  case_study_url: string | null;
  published: boolean;
  sort_order: number;
};

export type Experience = {
  id: number;
  role: string;
  company: string;
  location: string | null;
  period: string;
  summary: string | null;
  bullets: string[];
  tags: string[];
  sort_order: number;
};

export type Education = { id: number; label: string; year: string | null; is_degree: boolean; sort_order: number };

export type Content = {
  profile: Profile;
  stats: Stat[];
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  text: import("./siteText").SiteText;
  year: number;
  source: "supabase" | "fallback";
};

export const SKILL_CATEGORIES = ["Frontend", "Backend", "Database", "Tools / DevOps", "Other"] as const;
