import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SkipLink } from "@/components/layout/SkipLink";
import { Projects } from "@/components/sections/projects/Projects";
import { getContent } from "@/lib/content";
import { navLinks, visibleSections } from "@/lib/nav";

export async function generateMetadata(): Promise<Metadata> {
  const { text: t, profile } = await getContent();
  const heading = [t.projects_lead, t.projects_accent].filter(Boolean).join(" ");
  return {
    title: [heading, profile.name].filter(Boolean).join(" | "),
    description: t.projects_page_sub || t.projects_sub,
  };
}

/** /projects — every published project (the home page shows the first few). */
export default async function AllProjects() {
  const c = await getContent();
  const t = c.text;
  if (!visibleSections(c).projects) notFound();

  return (
    <>
      <SkipLink label={t.skip_link} />
      <Navbar name={c.profile.name} initials={c.profile.initials} links={navLinks(c)} cta={t.nav_cta} base="/" current="#projects" />
      <main id="main" className="pt-20 md:pt-24">
        <div className="container-x">
          <Link href="/#projects" className="inline-flex min-h-10 items-center gap-1.5 text-sm text-muted hover:text-ink">
            <ArrowLeft className="size-4" aria-hidden="true" /> {t.projects_back}
          </Link>
        </div>
        <Projects projects={c.projects} t={t} sub={t.projects_page_sub} />
      </main>
      <Footer name={c.profile.name} initials={c.profile.initials} t={t} />
    </>
  );
}
