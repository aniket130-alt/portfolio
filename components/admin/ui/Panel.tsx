import type { ReactNode } from "react";

/** Centered message card (setup problems, access denied…). */
export function Panel({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <section className="card mx-auto max-w-lg p-6 sm:p-8">
      <h1 className="flex items-center gap-2 text-xl font-bold">{icon}{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted [&_code]:rounded [&_code]:bg-surface-2 [&_code]:px-1.5 [&_code]:text-ink">
        {children}
      </p>
    </section>
  );
}
