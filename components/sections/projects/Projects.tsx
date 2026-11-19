import type { SiteText } from "@/lib/siteText";
import type { Project } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "./ProjectCard";

export function Projects({ projects, t }: { projects: Project[]; t: SiteText }) {
  return (
    <Section id="projects">
      <SectionHeading id="projects-title" lead={t.projects_lead} accent={t.projects_accent} sub={t.projects_sub} />
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal as="li" key={p.id} delay={(i % 3) * 70} className="h-full">
            <ProjectCard
              project={p}
              labels={{ demo: t.project_demo_label, github: t.project_github_label, caseStudy: t.project_case_label }}
            />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
