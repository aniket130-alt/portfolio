import type { SiteText } from "@/lib/siteText";
import type { Education, Profile, Stat } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AboutCard } from "./AboutCard";
import { StatList } from "./StatList";

export function About({
  profile,
  stats,
  education,
  t,
}: {
  profile: Profile;
  stats: Stat[];
  education: Education[];
  t: SiteText;
}) {
  const degree = education.find((e) => e.is_degree) ?? education[0];
  const caption = degree?.label ?? "";

  return (
    <Section id="about">
      <SectionHeading id="about-title" lead={t.about_lead} accent={t.about_accent} />
      <div className="grid gap-6 md:gap-8 lg:grid-cols-[300px_1fr] lg:items-center lg:gap-12">
        <AboutCard image={profile.photo_url} alt={profile.name} initials={profile.initials} caption={caption} />

        {/* Bio gets the full width beside the image; stats sit underneath it. */}
        <div className="min-w-0">
          {profile.about && (
            <Reveal delay={80}>
              <p className="text-base leading-relaxed text-muted md:text-lg md:leading-relaxed">{profile.about}</p>
            </Reveal>
          )}
          {stats.length > 0 && (
            <Reveal delay={160} className={profile.about ? "mt-8" : ""}>
              <StatList stats={stats} />
            </Reveal>
          )}
        </div>
      </div>
    </Section>
  );
}
