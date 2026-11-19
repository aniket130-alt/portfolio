import type { ReactNode } from "react";

/** Page section wrapper: anchor id, consistent width and vertical spacing. */
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
    <section id={id} aria-labelledby={`${id}-title`} className={`container-x py-10 md:py-14 ${className}`}>
      {children}
    </section>
  );
}
