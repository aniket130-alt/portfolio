import { Check } from "lucide-react";
import type { Project } from "@/lib/types";
import { TagList } from "@/components/ui/TagList";
import { ProjectLinks, type ProjectLinkLabels } from "./ProjectLinks";
import { ProjectThumbnail } from "./ProjectThumbnail";

/** One project: thumbnail, title, one-line value, key features, stack tags and links. */
export function ProjectCard({ project: p, labels }: { project: Project; labels: ProjectLinkLabels }) {
  return (
    <article className="group card flex h-full flex-col overflow-hidden transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_18px_50px_-20px_rgb(37_137_255/0.55)] focus-within:-translate-y-1 focus-within:border-accent/50 focus-within:shadow-[0_18px_50px_-20px_rgb(37_137_255/0.55)]">
      <ProjectThumbnail image={p.image_url} title={p.title} />

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

        <TagList tags={p.tags} label={`${p.title} tech stack`} className="mt-5" />
        <ProjectLinks project={p} labels={labels} />
      </div>
    </article>
  );
}
