/** Section title: plain word + gradient word + hairline, optional subtitle. */
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
