import * as simpleIcons from "simple-icons";
import type { SVGProps } from "react";

type SimpleIcon = { slug: string; title: string; path: string; hex: string };

// slug → icon (server-only: this module is never imported by client components)
const bySlug = new Map<string, SimpleIcon>(
  Object.values(simpleIcons as unknown as Record<string, SimpleIcon>)
    .filter((i) => i && typeof i === "object" && "slug" in i)
    .map((i) => [i.slug, i])
);

export function hasBrandIcon(slug: string | null | undefined) {
  return !!slug && bySlug.has(slug);
}

/** Technology / brand logo from simple-icons, by slug ("react", "go", "postgresql"…). */
export function BrandIcon({
  slug,
  className = "size-4",
  colored = false,
}: {
  slug: string;
  className?: string;
  colored?: boolean;
}) {
  const icon = bySlug.get(slug);
  if (!icon) return null;
  // Very dark brand colours (Next.js, GitHub, Vercel, X…) would vanish on navy — use ink instead.
  const hex = icon.hex.toLowerCase();
  const dark = parseInt(hex.slice(0, 2), 16) + parseInt(hex.slice(2, 4), 16) + parseInt(hex.slice(4, 6), 16) < 160;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={colored && !dark ? `#${icon.hex}` : "currentColor"}
      aria-hidden="true"
      focusable="false"
    >
      <path d={icon.path} />
    </svg>
  );
}

/** LinkedIn isn't in simple-icons; a simple line glyph that matches Lucide's style. */
export function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="4" />
      <path d="M8 10.5V17M8 7.25v.01M12 17v-6.5M12 13.25a2.75 2.75 0 0 1 5.5 0V17" />
    </svg>
  );
}
