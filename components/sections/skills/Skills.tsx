import type { SiteText } from "@/lib/siteText";
import type { Skill } from "@/lib/types";
import { SKILL_CATEGORIES } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SkillGroup } from "./SkillGroup";

/** Groups skills by category: suggested groups first, then any custom group names from admin. */
function groupSkills(skills: Skill[]) {
  const order = [...SKILL_CATEGORIES, ...skills.map((s) => s.category)].filter((c, i, a) => a.indexOf(c) === i);
  return order
    .map((category) => ({ category, items: skills.filter((s) => s.category === category) }))
    .filter((g) => g.items.length);
}

export function Skills({ skills, t }: { skills: Skill[]; t: SiteText }) {
  return (
    <Section id="skills">
      <SectionHeading id="skills-title" lead={t.skills_lead} accent={t.skills_accent} sub={t.skills_sub} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groupSkills(skills).map((g, i) => (
          <Reveal key={g.category} delay={i * 60} className="card p-5 md:p-6">
            <SkillGroup category={g.category} skills={g.items} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
