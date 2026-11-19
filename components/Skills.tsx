import { Code } from "lucide-react";
import type { Skill } from "@/lib/types";
import { SKILL_CATEGORIES } from "@/lib/types";
import type { SiteText } from "@/lib/siteText";
import { BrandIcon, hasBrandIcon } from "./icons";
import { Reveal } from "./Reveal";
import { Section, SectionHeading } from "./ui";

export function Skills({ skills, t }: { skills: Skill[]; t: SiteText }) {
  // Known categories first in blueprint order, then any custom ones.
  const order = [...SKILL_CATEGORIES, ...new Set(skills.map((s) => s.category))].filter(
    (c, i, a) => a.indexOf(c) === i
  );
  const groups = order
    .map((c) => ({ category: c, items: skills.filter((s) => s.category === c) }))
    .filter((g) => g.items.length);

  return (
    <Section id="skills">
      <SectionHeading id="skills-title" lead={t.skills_lead} accent={t.skills_accent} sub={t.skills_sub} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g, i) => (
          <Reveal key={g.category} delay={i * 60} className="card p-5 md:p-6">
            <h3 className="text-sm font-semibold tracking-wide text-accent-soft uppercase">{g.category}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {g.items.map((s) => (
                <li
                  key={s.id}
                  className="flex min-h-10 items-center gap-2 rounded-xl border border-line bg-surface-2/60 px-3 text-sm font-medium transition-colors duration-200 hover:border-line-strong"
                >
                  {hasBrandIcon(s.icon) ? (
                    <BrandIcon slug={s.icon!} colored className="size-4" />
                  ) : (
                    <Code className="size-4 text-accent-soft" aria-hidden="true" />
                  )}
                  {s.name}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
