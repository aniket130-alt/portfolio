import type { SiteText } from "@/lib/siteText";
import type { Project } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "./ProjectCard";
import { ViewAllCard } from "./ViewAllCard";

export function Projects({
  projects,
  t,
  limit,
  sub = t.projects_sub,
}: {
  projects: Project[];
  t: SiteText;
  /** Show at most this many, then a "View all projects" card linking to /projects. */
  limit?: number;
  sub?: string;
}) {
  const cut = limit !== undefined && projects.length > limit;
  const shown = cut ? projects.slice(0, limit) : projects;

  return (
    <Section id="projects">
      <SectionHeading id="projects-title" lead={t.projects_lead} accent={t.projects_accent} sub={sub} />
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => (
          <Reveal as="li" key={p.id} delay={(i % 3) * 70} className="h-full">
            <ProjectCard
              project={p}
              labels={{ demo: t.project_demo_label, github: t.project_github_label, caseStudy: t.project_case_label, link: t.project_link_label }}
            />
          </Reveal>
        ))}
        {cut && (
          <Reveal as="li" delay={(shown.length % 3) * 70} className="h-full">
            <ViewAllCard label={t.projects_view_all} more={`+${projects.length - shown.length} ${t.projects_more}`.trim()} />
          </Reveal>
        )}
      </ul>
    </Section>
  );
}
