import { Code } from "lucide-react";
import type { Skill } from "@/lib/types";
import { BrandIcon, hasBrandIcon } from "@/components/ui/BrandIcon";

/** One skill group: category title + chips with the technology's logo. */
export function SkillGroup({ category, skills }: { category: string; skills: Skill[] }) {
  return (
    <>
      <h3 className="text-sm font-semibold tracking-wide text-accent-soft uppercase">{category}</h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {skills.map((s) => (
          <li
            key={s.id}
            className="flex min-h-10 items-center gap-2 rounded-xl border border-line bg-surface-2/60 px-3 text-sm font-medium transition-colors duration-200 hover:border-line-strong"
          >
            {hasBrandIcon(s.icon) ? (
              <BrandIcon slug={s.icon!} colored className="size-4" />
            ) : (
              <Code className="size-4 text-accent-soft" aria-hidden="true" />
            )}
            {s.name}
          </li>
        ))}
      </ul>
    </>
  );
}
