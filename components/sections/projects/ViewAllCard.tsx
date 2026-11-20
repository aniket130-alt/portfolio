import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";

/** The card after the first few projects on the home page, linking to /projects. */
export function ViewAllCard({ label, more }: { label: string; more: string }) {
  return (
    <Link
      href="/projects"
      className="group card flex h-full min-h-64 flex-col items-center justify-center gap-4 border-dashed p-6 text-center transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_18px_50px_-20px_var(--color-glow)]"
    >
      <span className="grid size-14 place-items-center rounded-2xl bg-accent/10 text-accent-soft">
        <LayoutGrid className="size-6" aria-hidden="true" />
      </span>
      <span className="flex items-center gap-2 text-lg font-semibold tracking-tight">
        {label}
        <ArrowRight className="size-5 text-accent-soft transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
      </span>
      <span className="text-sm text-muted">{more}</span>
    </Link>
  );
}
