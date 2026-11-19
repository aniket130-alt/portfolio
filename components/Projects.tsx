import { ArrowUpRight, Check, FileText, Layers } from "lucide-react";
import type { Project } from "@/lib/types";
import type { SiteText } from "@/lib/siteText";
import { BrandIcon } from "./icons";
import { Reveal } from "./Reveal";
import { Section, SectionHeading } from "./ui";

export function Projects({ projects, t }: { projects: Project[]; t: SiteText }) {
  return (
    <Section id="projects">
      <SectionHeading id="projects-title" lead={t.projects_lead} accent={t.projects_accent} sub={t.projects_sub} />
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal as="li" key={p.id} delay={(i % 3) * 70} className="h-full">
            <ProjectCard project={p} t={t} />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

function ProjectCard({ project: p, t }: { project: Project; t: SiteText }) {
  const links = [
    p.demo_url && { href: p.demo_url, label: t.project_demo_label, icon: <ArrowUpRight className="size-4" aria-hidden="true" />, primary: true },
    p.github_url && { href: p.github_url, label: t.project_github_label, icon: <BrandIcon slug="github" className="size-3.5" />, primary: false },
    p.case_study_url && { href: p.case_study_url, label: t.project_case_label, icon: <FileText className="size-4" aria-hidden="true" />, primary: false },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode; primary: boolean }[];

  return (
    <article className="group card flex h-full flex-col overflow-hidden transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_18px_50px_-20px_rgb(37_137_255/0.55)] focus-within:-translate-y-1 focus-within:border-accent/50 focus-within:shadow-[0_18px_50px_-20px_rgb(37_137_255/0.55)]">
      <div className="relative aspect-video overflow-hidden border-b border-line bg-surface-2">
        {p.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.image_url}
            alt={`Screenshot of ${p.title}`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_30%_20%,rgb(37_137_255/0.28),transparent_60%),linear-gradient(135deg,#12203a,#0a1424)]">
            <div className="flex flex-col items-center gap-2 text-accent-soft/80">
              <Layers className="size-8" aria-hidden="true" />
              <span className="text-sm font-semibold text-ink/80">{p.title}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
        {p.description && <p className="mt-2 text-sm leading-relaxed text-muted">{p.description}</p>}

        {p.features.length > 0 && (
          <ul className="mt-4 space-y-1.5">
            {p.features.slice(0, 4).map((f) => (
              <li key={f} className="flex gap-2 text-sm text-muted">
                <Check className="mt-0.5 size-4 shrink-0 text-accent-soft" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        )}

        {p.tags.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tech stack">
            {p.tags.map((tag) => (
              <li key={tag} className="chip">{tag}</li>
            ))}
          </ul>
        )}

        {links.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2 pt-6">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className={l.primary ? "btn-primary min-h-10 px-4" : "btn-outline min-h-10 px-4"}
                aria-label={`${l.label}: ${p.title}`}
              >
                {l.icon} {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
