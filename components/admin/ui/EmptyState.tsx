import type { ReactNode } from "react";

/** Dashed placeholder for empty lists. */
export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-line-strong p-8 text-center text-sm text-muted">{children}</p>
  );
}

export function Loading() {
  return <p className="text-sm text-muted">Loading…</p>;
}
