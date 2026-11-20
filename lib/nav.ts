import type { NavLink } from "@/components/layout/Navbar";
import { isOn } from "./siteText";
import type { Content } from "./types";

/** How many projects the home page shows before the "View all projects" card. */
export const HOME_PROJECT_LIMIT = 5;

/** Which sections are visible (admin toggles + has data). Shared by the home and /projects pages. */
export function visibleSections(c: Content) {
  const t = c.text;
  return {
    about: isOn(t.show_about) && Boolean(c.profile.about || c.profile.photo_url || c.stats.length || c.education.length),
    projects: isOn(t.show_projects) && c.projects.length > 0,
    experience: isOn(t.show_experience) && c.experience.length > 0,
    skills: isOn(t.show_skills) && c.skills.length > 0,
  };
}

/** Navbar links for the visible sections (section anchors on the home page). */
export function navLinks(c: Content): NavLink[] {
  const t = c.text;
  const show = visibleSections(c);
  return [
    { href: "#home", label: t.nav_home },
    show.about && { href: "#about", label: t.nav_about },
    show.projects && { href: "#projects", label: t.nav_projects },
    show.experience && { href: "#experience", label: t.nav_experience },
    show.skills && { href: "#skills", label: t.nav_skills },
    { href: "#contact", label: t.nav_contact },
  ].filter(Boolean) as NavLink[];
}
