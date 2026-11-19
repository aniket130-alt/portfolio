import type { ReactNode } from "react";

/** AJ monogram — two geometric strokes, scales with font-size via className. */
export function Monogram({ initials = "AJ", className = "size-9" }: { initials?: string; className?: string }) {
  return (
    <span
      className={`${className} relative grid shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent to-[#1660d6] font-extrabold tracking-tight text-white shadow-[0_6px_24px_-8px_rgb(37_137_255/0.9)]`}
      aria-hidden="true"
    >
      <span className="text-[0.95em] leading-none">{initials}</span>
    </span>
  );
}

/** "About Me" style heading: plain word + gradient word + hairline. */
export function SectionHeading({
  id,
  lead,
  accent,
  sub,
}: {
  id?: string;
  lead: string;
  accent: string;
  sub?: string;
}) {
  return (
    <div className="mb-8 md:mb-10">
      <div className="flex items-center gap-4">
        <h2 id={id} className="shrink-0 text-2xl font-bold tracking-tight md:text-3xl">
          {lead} <span className="gradient-text">{accent}</span>
        </h2>
        <span className="h-px flex-1 bg-gradient-to-r from-line-strong to-transparent" aria-hidden="true" />
      </div>
      {sub && <p className="mt-2 text-sm text-muted md:text-base">{sub}</p>}
    </div>
  );
}

export function Section({
  id,
  children,
  className = "",
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`container-x py-16 md:py-24 ${className}`}>
      {children}
    </section>
  );
}
