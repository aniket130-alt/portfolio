import type { Profile } from "@/lib/types";
import { BrandIcon, LinkedInIcon } from "./icons";

/** GitHub and LinkedIn first (per blueprint), then optional profiles. Only links that are set render. */
export function SocialLinks({ profile, size = "md" }: { profile: Profile; size?: "md" | "lg" }) {
  const links = [
    profile.github_url && { href: profile.github_url, label: "GitHub", icon: <BrandIcon slug="github" className="size-[18px]" /> },
    profile.linkedin_url && { href: profile.linkedin_url, label: "LinkedIn", icon: <LinkedInIcon className="size-[19px]" /> },
    profile.instagram_url && { href: profile.instagram_url, label: "Instagram", icon: <BrandIcon slug="instagram" className="size-[18px]" /> },
    profile.x_url && { href: profile.x_url, label: "X (Twitter)", icon: <BrandIcon slug="x" className="size-4" /> },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[];

  if (!links.length) return null;
  const box = size === "lg" ? "size-11" : "size-10";

  return (
    <ul className="flex items-center gap-2">
      {links.map((l) => (
        <li key={l.label}>
          <a
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${profile.name} on ${l.label}`}
            className={`${box} grid place-items-center rounded-xl border border-line text-muted transition-colors duration-200 hover:border-accent-soft hover:text-ink`}
          >
            {l.icon}
          </a>
        </li>
      ))}
    </ul>
  );
}
