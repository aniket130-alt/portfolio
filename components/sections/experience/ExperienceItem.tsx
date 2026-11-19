import { MapPin } from "lucide-react";
import type { Experience } from "@/lib/types";
import { TagList } from "@/components/ui/TagList";

/** One timeline entry: dot, role — company, location, dates, impact bullets, tags. */
export function ExperienceItem({ entry: e }: { entry: Experience }) {
  return (
    <>
      <span
        aria-hidden="true"
        className="absolute top-2 left-0 size-[15px] rounded-full border-[3px] border-bg bg-accent shadow-[0_0_0_4px_rgb(37_137_255/0.2)]"
      />
      <div className="card p-5 md:p-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div>
            <h3 className="text-base font-semibold md:text-lg">
              {e.role} <span className="text-muted">— {e.company}</span>
            </h3>
            {e.location && (
              <p className="mt-1 flex items-center gap-1 text-xs text-subtle">
                <MapPin className="size-3.5" aria-hidden="true" /> {e.location}
              </p>
            )}
          </div>
          {e.period && <p className="shrink-0 text-sm font-medium text-accent-soft">{e.period}</p>}
        </div>

        {e.summary && <p className="mt-3 text-sm text-muted">{e.summary}</p>}

        {e.bullets.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {e.bullets.map((b) => (
              <li
                key={b}
                className="relative pl-4 text-sm leading-relaxed text-muted before:absolute before:top-[0.6em] before:left-0 before:size-1.5 before:rounded-full before:bg-accent-soft/70"
              >
                {b}
              </li>
            ))}
          </ul>
        )}

        <TagList tags={e.tags} label={`${e.role} technologies`} className="mt-4" />
      </div>
    </>
  );
}
