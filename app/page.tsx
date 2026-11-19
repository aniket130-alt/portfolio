import { Footer } from "@/components/layout/Footer";
import { Navbar, type NavLink } from "@/components/layout/Navbar";
import { SkipLink } from "@/components/layout/SkipLink";
import { About } from "@/components/sections/about/About";
import { Contact } from "@/components/sections/contact/Contact";
import { Experience } from "@/components/sections/experience/Experience";
import { Hero } from "@/components/sections/hero/Hero";
import { Projects } from "@/components/sections/projects/Projects";
import { Skills } from "@/components/sections/skills/Skills";
import { getContent } from "@/lib/content";
import { isOn } from "@/lib/siteText";

export default async function Home() {
  const c = await getContent();
  const t = c.text;

  const show = {
    about:
      isOn(t.show_about) &&
      Boolean(c.profile.about || c.profile.photo_url || c.stats.length || c.education.length),
    projects: isOn(t.show_projects) && c.projects.length > 0,
    experience: isOn(t.show_experience) && c.experience.length > 0,
    skills: isOn(t.show_skills) && c.skills.length > 0,
  };

  const links: NavLink[] = [
    { href: "#home", label: t.nav_home },
    show.about && { href: "#about", label: t.nav_about },
    show.projects && { href: "#projects", label: t.nav_projects },
    show.experience && { href: "#experience", label: t.nav_experience },
    show.skills && { href: "#skills", label: t.nav_skills },
    { href: "#contact", label: t.nav_contact },
  ].filter(Boolean) as NavLink[];

  return (
    <>
      <SkipLink label={t.skip_link} />
      <Navbar name={c.profile.name} initials={c.profile.initials} links={links} cta={t.nav_cta} />
      <main id="main">
        <Hero profile={c.profile} t={t} />
        {show.about && <About profile={c.profile} stats={c.stats} education={c.education} t={t} />}
        {show.projects && <Projects projects={c.projects} t={t} />}
        {show.experience && <Experience items={c.experience} t={t} />}
        {show.skills && <Skills skills={c.skills} t={t} />}
        <Contact profile={c.profile} t={t} />
      </main>
      <Footer name={c.profile.name} initials={c.profile.initials} year={c.year} t={t} />
    </>
  );
}
