import { ArrowUpRight, FileText, Link2 } from "lucide-react";
import type { ReactNode } from "react";
import type { Project } from "@/lib/types";
import { BrandIcon } from "@/components/ui/BrandIcon";

export type ProjectLinkLabels = { demo: string; github: string; caseStudy: string; link: string };

/** Live demo / GitHub / Case study / custom-link buttons — each only appears when its URL is set. */
export function ProjectLinks({ project: p, labels }: { project: Project; labels: ProjectLinkLabels }) {
  const links = [
    p.demo_url && { href: p.demo_url, label: labels.demo, icon: <ArrowUpRight className="size-4" aria-hidden="true" />, primary: true },
    p.github_url && { href: p.github_url, label: labels.github, icon: <BrandIcon slug="github" className="size-3.5" />, primary: false },
    p.case_study_url && { href: p.case_study_url, label: labels.caseStudy, icon: <FileText className="size-4" aria-hidden="true" />, primary: false },
    p.extra_url && { href: p.extra_url, label: p.extra_label?.trim() || labels.link, icon: <Link2 className="size-4" aria-hidden="true" />, primary: !p.demo_url },
  ].filter(Boolean) as { href: string; label: string; icon: ReactNode; primary: boolean }[];

  if (!links.length) return null;
  return (
    <div className="mt-auto flex flex-wrap gap-2 pt-6">
      {links.map((l) => (
        <a
          key={l.href + l.label}
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
  );
}
