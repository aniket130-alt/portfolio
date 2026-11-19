import { Briefcase, Code, GraduationCap, Star, type LucideIcon } from "lucide-react";
import type { Stat } from "@/lib/types";

/** Icon names selectable in Admin → About → Stats (keep in sync with admin/config/fields.ts). */
export const STAT_ICONS: Record<string, LucideIcon> = {
  code: Code,
  briefcase: Briefcase,
  "graduation-cap": GraduationCap,
  star: Star,
};

/** Row of stats (up to 4 per row) with an icon, value and label. */
export function StatList({ stats }: { stats: Stat[] }) {
  return (
    <ul
      className="grid divide-x divide-line rounded-[var(--radius-card)] border border-line bg-surface/60"
      style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, minmax(0, 1fr))` }}
    >
      {stats.map((s) => {
        const Icon = STAT_ICONS[s.icon ?? ""] ?? Star;
        return (
          <li key={s.id} className="flex flex-col items-center px-3 py-5 text-center sm:px-6">
            <Icon className="size-6 text-accent-soft" aria-hidden="true" />
            <span className="mt-3 text-lg font-bold whitespace-nowrap sm:text-xl">{s.value}</span>
            <span className="mt-0.5 text-xs text-muted">{s.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
