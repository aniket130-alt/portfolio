import { cacheLife, cacheTag } from "next/cache";
import { fallbackContent } from "./fallback";
import { DEFAULT_TEXT, mergeText } from "./siteText";
import { serverClient, supabaseConfigured } from "./supabase";
import type { Content, Education, Experience, Profile, Project, Skill, Stat } from "./types";

export const CONTENT_TAG = "content";

const arr = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x) => typeof x === "string" && x.trim()) : []);
const str = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);

/** Only http(s) links reach the page — blocks javascript:, data: and other schemes. */
const url = (v: unknown): string | null => {
  const s = str(v);
  if (!s) return null;
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:" ? u.href : null;
  } catch {
    return null;
  }
};
/** Plain email only (used in mailto:). */
const email = (v: unknown): string | null => {
  const s = str(v);
  return s && /^[^\s@<>"'()]+@[^\s@<>"'()]+\.[^\s@<>"'()]{2,}$/.test(s) ? s : null;
};

function normProfile(p: Record<string, unknown> | null): Profile {
  const f = fallbackContent.profile;
  if (!p) return f;
  return {
    id: 1,
    name: str(p.name) ?? f.name,
    initials: str(p.initials) ?? f.initials,
    role: str(p.role) ?? f.role,
    headline: str(p.headline) ?? str(p.role),
    intro: str(p.intro),
    about: str(p.about),
    location: str(p.location),
    email: email(p.email),
    linkedin_url: url(p.linkedin_url),
    github_url: url(p.github_url),
    instagram_url: url(p.instagram_url),
    x_url: url(p.x_url),
    status_badge: str(p.status_badge),
    available: p.available === undefined ? Boolean(str(p.status_badge)) : Boolean(p.available),
    photo_url: url(p.photo_url),
    cv_url: url(p.cv_url),
    reply_note: str(p.reply_note),
  };
}

/**
 * All public content for the home page. Cached and tagged so the admin page can
 * refresh it instantly (updateTag) after a save; otherwise it refreshes hourly.
 */
export async function getContent(): Promise<Content> {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAG);

  const year = new Date().getFullYear();
  if (!supabaseConfigured) return { ...fallbackContent, text: DEFAULT_TEXT, year, source: "fallback" };

  const db = serverClient();
  const [text, profile, stats, skills, projects, experience, education] = await Promise.all([
    db.from("site_text").select("key, value"),
    db.from("profile").select("*").eq("id", 1).maybeSingle(),
    db.from("stats").select("*").order("sort_order"),
    db.from("skills").select("*").order("sort_order"),
    db.from("projects").select("*").eq("published", true).order("sort_order"),
    db.from("experience").select("*").order("sort_order"),
    db.from("education").select("*").order("sort_order"),
  ]);

  const failed = [text, profile, stats, skills, projects, experience, education].filter((r) => r.error);
  for (const r of failed) console.warn("[content] Supabase:", r.error?.message);
  const ok = <T,>(r: { error: unknown; data: T | null }, fb: T): T => (r.error || !r.data ? fb : r.data);

  return {
    profile: profile.error ? fallbackContent.profile : normProfile(profile.data),
    stats: ok(stats, fallbackContent.stats) as Stat[],
    skills: (ok(skills, fallbackContent.skills) as Record<string, unknown>[]).map((s) => ({
      id: Number(s.id),
      name: String(s.name),
      category: str(s.category) ?? "Other",
      icon: str(s.icon),
      sort_order: Number(s.sort_order ?? 0),
    })) as Skill[],
    projects: (ok(projects, fallbackContent.projects) as Record<string, unknown>[]).map((p) => ({
      id: Number(p.id),
      title: String(p.title),
      slug: str(p.slug),
      description: str(p.description),
      features: arr(p.features),
      tags: arr(p.tags),
      image_url: url(p.image_url),
      demo_url: url(p.demo_url),
      github_url: url(p.github_url),
      // Old v1 column "link_url" becomes the case-study / details link.
      case_study_url: url(p.case_study_url) ?? url(p.link_url),
      published: true,
      sort_order: Number(p.sort_order ?? 0),
    })) as Project[],
    experience: (ok(experience, fallbackContent.experience) as Record<string, unknown>[]).map((e) => ({
      id: Number(e.id),
      role: String(e.role),
      company: String(e.company),
      location: str(e.location),
      period: String(e.period ?? ""),
      summary: str(e.summary),
      bullets: arr(e.bullets),
      tags: arr(e.tags),
      sort_order: Number(e.sort_order ?? 0),
    })) as Experience[],
    education: ok(education, fallbackContent.education) as Education[],
    text: mergeText(text.error ? null : text.data),
    year,
    source: failed.length ? "fallback" : "supabase",
  };
}
