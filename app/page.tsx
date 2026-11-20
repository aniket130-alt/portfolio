import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SkipLink } from "@/components/layout/SkipLink";
import { About } from "@/components/sections/about/About";
import { Contact } from "@/components/sections/contact/Contact";
import { Experience } from "@/components/sections/experience/Experience";
import { Hero } from "@/components/sections/hero/Hero";
import { Projects } from "@/components/sections/projects/Projects";
import { Skills } from "@/components/sections/skills/Skills";
import { getContent } from "@/lib/content";
import { HOME_PROJECT_LIMIT, navLinks, visibleSections } from "@/lib/nav";

export default async function Home() {
  const c = await getContent();
  const t = c.text;

  const show = visibleSections(c);
  const links = navLinks(c);

  return (
    <>
      <SkipLink label={t.skip_link} />
      <Navbar name={c.profile.name} initials={c.profile.initials} links={links} cta={t.nav_cta} />
      <main id="main">
        <Hero profile={c.profile} t={t} />
        {show.about && <About profile={c.profile} stats={c.stats} education={c.education} t={t} />}
        {show.projects && <Projects projects={c.projects} t={t} limit={HOME_PROJECT_LIMIT} />}
        {show.experience && <Experience items={c.experience} t={t} />}
        {show.skills && <Skills skills={c.skills} t={t} />}
        <Contact profile={c.profile} t={t} />
      </main>
      <Footer name={c.profile.name} initials={c.profile.initials} t={t} />
    </>
  );
}
