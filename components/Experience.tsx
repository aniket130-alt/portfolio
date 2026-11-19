import { MapPin } from "lucide-react";
import type { Experience as Exp } from "@/lib/types";
import type { SiteText } from "@/lib/siteText";
import { Reveal } from "./Reveal";
import { Section, SectionHeading } from "./ui";

export function Experience({ items, t }: { items: Exp[]; t: SiteText }) {
  return (
    <Section id="experience">
      <SectionHeading id="experience-title" lead={t.experience_lead} accent={t.experience_accent} sub={t.experience_sub} />
      <ol className="relative space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-px before:bg-gradient-to-b before:from-accent before:via-line-strong before:to-transparent md:space-y-8">
        {items.map((e, i) => (
          <Reveal as="li" key={e.id} delay={i * 60} className="relative pl-9 md:pl-12">
            <span
              aria-hidden="true"
              className="absolute top-2 left-0 size-[15px] rounded-full border-[3px] border-bg bg-accent shadow-[0_0_0_4px_rgb(37_137_255/0.2)]"
            />
            <div className="card p-5 md:p-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div>
                  <h3 className="text-base font-semibold md:text-lg">
                    {e.role} <span className="text-muted">— {e.company}</span>
                  </h3>
                  {e.location && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-subtle">
                      <MapPin className="size-3.5" aria-hidden="true" /> {e.location}
                    </p>
                  )}
                </div>
                {e.period && <p className="shrink-0 text-sm font-medium text-accent-soft">{e.period}</p>}
              </div>

              {e.summary && <p className="mt-3 text-sm text-muted">{e.summary}</p>}

              {e.bullets.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {e.bullets.map((b) => (
                    <li key={b} className="relative pl-4 text-sm leading-relaxed text-muted before:absolute before:top-[0.6em] before:left-0 before:size-1.5 before:rounded-full before:bg-accent-soft/70">
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              {e.tags.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
                  {e.tags.map((tag) => (
                    <li key={tag} className="chip">{tag}</li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
