import { Briefcase, Code, GraduationCap, MapPin, Star, type LucideIcon } from "lucide-react";
import type { Education, Profile, Stat } from "@/lib/types";
import type { SiteText } from "@/lib/siteText";
import { Reveal } from "./Reveal";
import { Monogram, Section, SectionHeading } from "./ui";

const STAT_ICONS: Record<string, LucideIcon> = {
  code: Code,
  briefcase: Briefcase,
  "graduation-cap": GraduationCap,
  star: Star,
};

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
  const meta = [degree?.label, profile.location].filter(Boolean).join(" • ");

  return (
    <Section id="about">
      <SectionHeading id="about-title" lead={t.about_lead} accent={t.about_accent} />
      <div className="grid gap-6 lg:grid-cols-[260px_1fr_auto] lg:items-center lg:gap-10">
        <Reveal className="card relative grid aspect-[4/3] place-items-center overflow-hidden p-6 lg:aspect-square">
          <div aria-hidden="true" className="absolute inset-x-6 bottom-10 h-16 rounded-[50%] border border-accent/40 blur-[1px]" />
          <div aria-hidden="true" className="absolute size-40 rounded-full bg-accent/20 blur-3xl" />
          {profile.photo_url ? (
            // Uncropped so logos keep their shape; sits above the location line.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.photo_url}
              alt={profile.name}
              className="relative mb-8 max-h-[62%] max-w-[78%] object-contain drop-shadow-[0_10px_30px_rgb(37_137_255/0.35)]"
            />
          ) : (
            <Monogram initials={profile.initials} className="relative size-20 text-3xl" />
          )}
          {meta && (
            <p className="absolute inset-x-4 bottom-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
              <MapPin className="size-3.5 shrink-0 text-accent-soft" aria-hidden="true" />
              {meta}
            </p>
          )}
        </Reveal>

        {profile.about && (
          <Reveal delay={80}>
            <p className="text-base leading-relaxed text-muted md:text-lg">{profile.about}</p>
          </Reveal>
        )}

        {stats.length > 0 && (
          <Reveal delay={160}>
            <ul className="grid grid-cols-3 divide-x divide-line rounded-[var(--radius-card)] border border-line bg-surface/60 lg:border-0 lg:border-l lg:bg-transparent lg:rounded-none">
              {stats.map((s) => {
                const Icon = STAT_ICONS[s.icon ?? ""] ?? Star;
                return (
                  <li key={s.id} className="flex flex-col items-center px-4 py-5 text-center sm:px-6 lg:px-7">
                    <Icon className="size-6 text-accent-soft" aria-hidden="true" />
                    <span className="mt-3 text-lg font-bold whitespace-nowrap sm:text-xl">{s.value}</span>
                    <span className="mt-0.5 text-xs text-muted">{s.label}</span>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        )}
      </div>
    </Section>
  );
}

export const STAT_ICON_NAMES = Object.keys(STAT_ICONS);
