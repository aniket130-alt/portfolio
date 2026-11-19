import type { ReactNode } from "react";

/** Titled block inside an admin tab (e.g. About → Stats). */
export function Subsection({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mb-4 text-sm text-muted">{sub}</p>
      {children}
    </section>
  );
}
