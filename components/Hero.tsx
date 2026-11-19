import { ArrowRight, Download } from "lucide-react";
import type { Profile } from "@/lib/types";
import type { SiteText } from "@/lib/siteText";
import { isOn } from "@/lib/siteText";
import { HeroArt } from "./HeroArt";
import { SocialLinks } from "./SocialLinks";

export function Hero({ profile, t }: { profile: Profile; t: SiteText }) {
  const [first, ...rest] = profile.name.split(" ");
  const showArt = isOn(t.show_hero_art);

  return (
    <section id="home" aria-labelledby="home-title" className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      {/* faint grid + glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgb(148_170_200/0.07)_1px,transparent_1px),linear-gradient(90deg,rgb(148_170_200/0.07)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_60%_35%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10%] size-[640px] rounded-full bg-accent/20 blur-[120px]"
      />

      <div className={`container-x relative grid items-center gap-12 ${showArt ? "lg:grid-cols-[1.1fr_1fr]" : ""}`}>
        <div className="max-w-2xl">
          {profile.available && profile.status_badge && (
            <p className="inline-flex items-center gap-2 rounded-full border border-success/25 bg-success/10 px-3 py-1 text-xs font-medium text-success">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              {profile.status_badge}
            </p>
          )}

          <h1 id="home-title" className="mt-6 text-[2.75rem] font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            {t.hero_greeting}
            <br />
            <span className="gradient-text">
              {first} {rest.join(" ")}
            </span>
          </h1>

          {profile.headline && <p className="mt-5 text-lg font-semibold text-ink sm:text-xl">{profile.headline}</p>}
          {profile.intro && <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{profile.intro}</p>}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#projects" className="btn-primary">
              {t.hero_cta_primary} <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            {profile.cv_url && (
              <a href={profile.cv_url} className="btn-outline" download target="_blank" rel="noopener">
                <Download className="size-4" aria-hidden="true" /> {t.hero_cta_resume}
              </a>
            )}
          </div>

          <div className="mt-8">
            <SocialLinks profile={profile} />
          </div>
        </div>

        {showArt && (
          <div className="relative mx-auto hidden w-full max-w-[520px] md:block">
            <HeroArt />
          </div>
        )}
      </div>
    </section>
  );
}
