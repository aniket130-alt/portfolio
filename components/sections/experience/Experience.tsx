import type { SiteText } from "@/lib/siteText";
import type { Experience as ExperienceEntry } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ExperienceItem } from "./ExperienceItem";

export function Experience({ items, t }: { items: ExperienceEntry[]; t: SiteText }) {
  return (
    <Section id="experience">
      <SectionHeading id="experience-title" lead={t.experience_lead} accent={t.experience_accent} sub={t.experience_sub} />
      <ol className="relative space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-px before:bg-gradient-to-b before:from-accent before:via-line-strong before:to-transparent md:space-y-8">
        {items.map((e, i) => (
          <Reveal as="li" key={e.id} delay={i * 60} className="relative pl-9 md:pl-12">
            <ExperienceItem entry={e} />
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
